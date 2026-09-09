import { supabase } from './supabaseClient';

export type RealtimeSyncEventType = 'WISHLIST_UPDATED' | 'CART_UPDATED' | 'AUTH_CHANGED';

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

// Global Supabase Realtime WebSocket channel for cross-tab and cross-device sync
let supabaseRealtimeChannel: ReturnType<typeof supabase.channel> | null = null;
const subscribers = new Set<(message: RealtimeSyncMessage) => void>();

function initRealtimeChannel() {
  if (typeof window === 'undefined' || supabaseRealtimeChannel) return;

  try {
    supabaseRealtimeChannel = supabase.channel('house_of_gargi_patron_sync', {
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
      .subscribe();

    // Listen to local BroadcastChannel as well
    if (localBroadcastChannel) {
      localBroadcastChannel.onmessage = (event) => {
        const msg = event.data as RealtimeSyncMessage;
        if (msg && msg.tabId !== currentTabId) {
          notifySubscribers(msg);
        }
      };
    }

    // Storage event fallback for older browsers or backgrounded tabs
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
 * Broadcast an event across all open tabs and devices in real-time
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

  // 1. Broadcast via local BroadcastChannel (instant)
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
 * Subscribe to real-time portal updates (Wishlist, Cart, Auth)
 */
export function subscribeToPortalSync(callback: (message: RealtimeSyncMessage) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  initRealtimeChannel();
  subscribers.add(callback);

  return () => {
    subscribers.delete(callback);
  };
}
