import { useEffect } from 'react';
import { supabase } from './supabaseClient';

export type RealtimeSyncEventType =
  | 'WISHLIST_UPDATED'
  | 'CART_UPDATED'
  | 'AUTH_CHANGED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'PRODUCT_VISIBILITY_CHANGED'
  | 'PRODUCT_STATUS_CHANGED'
  | 'ARTISAN_APPLICATION_CHANGED'
  | 'ARTISAN_PROFILE_UPDATED'
  | 'ORDER_STATUS_CHANGED'
  | 'PORTAL_CATALOG_SYNC';

export interface RealtimeSyncMessage<T = any> {
  type: RealtimeSyncEventType;
  email?: string | null;
  payload: T;
  timestamp: number;
  tabId: string;
}

// Unique identifier for the current tab to prevent redundant self-echo
const currentTabId = typeof window !== 'undefined' 
  ? Math.random().toString(36).substring(2, 9) 
  : 'server';

// Browser native BroadcastChannel for instant local 0ms cross-tab sync
let localBroadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    localBroadcastChannel = new BroadcastChannel('gargi_realtime_portal_sync');
  } catch (e) {
    console.warn('BroadcastChannel initialization fallback:', e);
  }
}

// Global Supabase Realtime WebSocket channel for cross-portal and cross-device sync
let supabaseRealtimeChannel: ReturnType<typeof supabase.channel> | null = null;
const subscribers = new Set<(message: RealtimeSyncMessage) => void>();

function initRealtimeChannel() {
  if (typeof window === 'undefined' || supabaseRealtimeChannel) return;

  try {
    // 1. Unified broadcast channel for immediate peer-to-peer event relay
    supabaseRealtimeChannel = supabase.channel('house_of_gargi_portal_websocket_sync', {
      config: {
        broadcast: { self: false }
      }
    });

    supabaseRealtimeChannel
      .on('broadcast', { event: 'portal_sync' }, (eventPayload) => {
        const msg = eventPayload.payload as RealtimeSyncMessage;
        if (msg && msg.tabId !== currentTabId) {
          notifySubscribers(msg);
        }
      })
      // 2. Listen to PostgreSQL Table Changes directly via Supabase Realtime WebSockets
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        const eventType: RealtimeSyncEventType =
          payload.eventType === 'INSERT'
            ? 'PRODUCT_CREATED'
            : payload.eventType === 'DELETE'
            ? 'PRODUCT_DELETED'
            : 'PRODUCT_UPDATED';

        notifySubscribers({
          type: eventType,
          payload: {
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
            id: (payload.new as any)?.id || (payload.old as any)?.id,
          },
          timestamp: Date.now(),
          tabId: 'supabase_postgres_realtime',
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artisan_applications' }, (payload) => {
        notifySubscribers({
          type: 'ARTISAN_APPLICATION_CHANGED',
          payload: {
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
          },
          timestamp: Date.now(),
          tabId: 'supabase_postgres_realtime',
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        notifySubscribers({
          type: 'ORDER_STATUS_CHANGED',
          payload: {
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
          },
          timestamp: Date.now(),
          tabId: 'supabase_postgres_realtime',
        });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[WebSocket Hub] Connected to House of Gargi Realtime synchronization channel');
        }
      });

    // 3. Listen to local native BroadcastChannel (0ms latency across tabs on the same computer)
    if (localBroadcastChannel) {
      localBroadcastChannel.onmessage = (event) => {
        const msg = event.data as RealtimeSyncMessage;
        if (msg && msg.tabId !== currentTabId) {
          notifySubscribers(msg);
        }
      };
    }

    // 4. Storage event fallback for backgrounded tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'gargi_tab_sync_event' && e.newValue) {
        try {
          const msg = JSON.parse(e.newValue) as RealtimeSyncMessage;
          if (msg && msg.tabId !== currentTabId) {
            notifySubscribers(msg);
          }
        } catch {}
      }
    });
  } catch (e) {
    console.warn('Realtime channel subscription notice:', e);
  }
}

function notifySubscribers(message: RealtimeSyncMessage) {
  subscribers.forEach((callback) => {
    try {
      callback(message);
    } catch (err) {
      console.error('Error in realtime subscriber callback:', err);
    }
  });
}

/**
 * Broadcast an event across all open portals (Super Admin, Operations Admin, Artisan)
 * and across devices in real-time via WebSockets & BroadcastChannel.
 */
export function broadcastPortalSync<T = any>(
  type: RealtimeSyncEventType,
  payload: T,
  email?: string | null
) {
  if (typeof window === 'undefined') return;

  initRealtimeChannel();

  const message: RealtimeSyncMessage<T> = {
    type,
    email: email || null,
    payload,
    timestamp: Date.now(),
    tabId: currentTabId,
  };

  // 1. Broadcast via local BroadcastChannel (instant 0ms cross-tab)
  if (localBroadcastChannel) {
    try {
      localBroadcastChannel.postMessage(message);
    } catch (e) {
      console.warn('Local broadcast failed:', e);
    }
  }

  // 2. Broadcast via Supabase Realtime WebSockets
  if (supabaseRealtimeChannel) {
    try {
      supabaseRealtimeChannel.send({
        type: 'broadcast',
        event: 'portal_sync',
        payload: message,
      });
    } catch (e) {
      console.warn('Supabase realtime broadcast failed:', e);
    }
  }

  // 3. Trigger storage event for local fallback
  try {
    localStorage.setItem('gargi_tab_sync_event', JSON.stringify(message));
  } catch {}
}

/**
 * Subscribe to real-time portal updates
 */
export function subscribeToPortalSync(callback: (message: RealtimeSyncMessage) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  initRealtimeChannel();
  subscribers.add(callback);

  return () => {
    subscribers.delete(callback);
  };
}

/**
 * React hook for real-time synchronization in portal components
 */
export function usePortalRealtimeSync(
  eventTypes: RealtimeSyncEventType[],
  onUpdate: (message: RealtimeSyncMessage) => void
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    initRealtimeChannel();

    const unsubscribe = subscribeToPortalSync((msg) => {
      if (
        eventTypes.includes(msg.type) ||
        eventTypes.includes('PORTAL_CATALOG_SYNC') ||
        (msg.type === 'PORTAL_CATALOG_SYNC' && eventTypes.some(t => t.startsWith('PRODUCT_')))
      ) {
        onUpdate(msg);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [eventTypes, onUpdate]);
}

// Convenience Broadcast Helpers
export function notifyProductCreated(product: any) {
  broadcastPortalSync('PRODUCT_CREATED', product);
  broadcastPortalSync('PORTAL_CATALOG_SYNC', { action: 'create', product });
}

export function notifyProductUpdated(product: any) {
  broadcastPortalSync('PRODUCT_UPDATED', product);
  broadcastPortalSync('PORTAL_CATALOG_SYNC', { action: 'update', product });
}

export function notifyProductDeleted(id: string, name?: string) {
  broadcastPortalSync('PRODUCT_DELETED', { id, name });
  broadcastPortalSync('PORTAL_CATALOG_SYNC', { action: 'delete', id, name });
}

export function notifyProductVisibilityChanged(id: string, isHidden: boolean) {
  broadcastPortalSync('PRODUCT_VISIBILITY_CHANGED', { id, isHidden });
  broadcastPortalSync('PORTAL_CATALOG_SYNC', { action: 'visibility', id, isHidden });
}

export function notifyProductStatusChanged(id: string, status: string) {
  broadcastPortalSync('PRODUCT_STATUS_CHANGED', { id, status });
  broadcastPortalSync('PORTAL_CATALOG_SYNC', { action: 'status', id, status });
}

export function notifyArtisanApplicationChanged(data: any) {
  broadcastPortalSync('ARTISAN_APPLICATION_CHANGED', data);
}

