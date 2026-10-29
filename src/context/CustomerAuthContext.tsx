'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { broadcastPortalSync, subscribeToPortalSync } from '@/lib/realtimeSync';
import { getUserRole, AppRole } from '@/lib/rbac';

export interface Customer {
  email: string;
  name?: string;
  id?: string;
  role?: AppRole;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isLoggedIn: boolean;
  role: AppRole | null;
  isLoginModalOpen: boolean;
  openLoginModal: (redirectUrl?: string) => void;
  closeLoginModal: () => void;
  login: (email: string, name?: string, id?: string, role?: AppRole) => void;
  logout: () => Promise<void>;
  redirectAfterLogin: string | null;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  // Initialize and synchronize session for customer portal
  useEffect(() => {
    try {
      // 1. Check direct customer login
      const storedCustomerEmail = localStorage.getItem('gargi_customer_email');
      const isDemo = localStorage.getItem('customer_auth_demo') === 'true';

      if (storedCustomerEmail) {
        const storedName = localStorage.getItem('gargi_customer_name') || 'Valued Patron';
        const storedId = localStorage.getItem('gargi_customer_id') || undefined;
        setCustomer({ email: storedCustomerEmail, name: storedName, id: storedId, role: 'patron' });
        setRole('patron');
        setIsLoggedIn(true);
      } else {
        // 2. If no direct customer session exists, check if an artisan is logged in.
        // Artisans can browse the customer portal as a customer without overlapping or mutating their artisan profile.
        const artisanStored = localStorage.getItem('artisan_session');
        if (artisanStored) {
          try {
            const parsed = JSON.parse(artisanStored);
            if (parsed.email) {
              setCustomer({ email: parsed.email, name: parsed.name || 'Master Artisan', role: 'patron' });
              setRole('patron');
              setIsLoggedIn(true);
            }
          } catch {}
        } else if (isDemo) {
          const demoEmail = 'patron@gargisaha.com';
          localStorage.setItem('gargi_customer_email', demoEmail);
          localStorage.setItem('gargi_customer_role', 'patron');
          setCustomer({ email: demoEmail, name: 'Valued Patron', role: 'patron' });
          setRole('patron');
          setIsLoggedIn(true);
        }
      }

      // Check active Supabase Auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          const userEmail = session.user.email.toLowerCase().trim();
          const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Valued Patron';
          
          setRole('patron');
          setCustomer({ email: userEmail, name: userName, id: session.user.id, role: 'patron' });
          setIsLoggedIn(true);
          localStorage.setItem('gargi_customer_email', userEmail);
          localStorage.setItem('gargi_customer_name', userName);
          localStorage.setItem('gargi_customer_id', session.user.id);
          localStorage.setItem('gargi_customer_role', 'patron');
        }
      });

      // Listen for live Supabase Auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email) {
          const userEmail = session.user.email.toLowerCase().trim();
          const userName = session.user.user_metadata?.name || 'Valued Patron';
          setRole('patron');
          setCustomer({ email: userEmail, name: userName, id: session.user.id, role: 'patron' });
          setIsLoggedIn(true);
          localStorage.setItem('gargi_customer_email', userEmail);
          localStorage.setItem('gargi_customer_name', userName);
          localStorage.setItem('gargi_customer_id', session.user.id);
          localStorage.setItem('gargi_customer_role', 'patron');
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('gargi_customer_email');
          localStorage.removeItem('gargi_customer_name');
          localStorage.removeItem('gargi_customer_id');
          localStorage.removeItem('gargi_customer_role');
          localStorage.removeItem('customer_auth_demo');
          setCustomer(null);
          setRole(null);
          setIsLoggedIn(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.warn('Failed initializing customer auth session:', e);
    }
  }, []);

  // Subscribe to real-time multi-tab cross-synchronization
  useEffect(() => {
    const unsubscribe = subscribeToPortalSync((message) => {
      if (message.type === 'AUTH_CHANGED') {
        const { action, email, name, id, portal: syncPortal } = message.payload || {};
        // Only react to customer portal actions so artisan or admin sessions are never disturbed
        if (syncPortal === 'customer' || !syncPortal) {
          if (action === 'login' && email) {
            setCustomer({ email, name: name || 'Valued Patron', id, role: 'patron' });
            setRole('patron');
            setIsLoggedIn(true);
          } else if (action === 'logout') {
            setCustomer(null);
            setRole(null);
            setIsLoggedIn(false);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const openLoginModal = (redirectUrl?: string) => {
    if (redirectUrl) setRedirectAfterLogin(redirectUrl);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setRedirectAfterLogin(null);
  };

  const login = (email: string, name = 'Valued Patron', id?: string, explicitRole?: AppRole) => {
    const cleanEmail = email.toLowerCase().trim();
    localStorage.setItem('gargi_customer_email', cleanEmail);
    localStorage.setItem('gargi_customer_name', name);
    if (id) localStorage.setItem('gargi_customer_id', id);
    localStorage.setItem('customer_auth_demo', 'true');

    // Customer portal login is strictly as a patron/customer
    const customerRole: AppRole = 'patron';
    localStorage.setItem('gargi_customer_role', customerRole);
    setRole(customerRole);
    setCustomer({ email: cleanEmail, name, id, role: customerRole });
    setIsLoggedIn(true);
    closeLoginModal();
    broadcastPortalSync('AUTH_CHANGED', { action: 'login', email: cleanEmail, name, id, role: customerRole, portal: 'customer' }, cleanEmail);
  };

  const logout = async () => {
    try {
      const currentEmail = customer?.email;
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

      // Strictly clear customer storage. NEVER delete artisan_session or admin_session!
      localStorage.removeItem('gargi_customer_email');
      localStorage.removeItem('gargi_customer_name');
      localStorage.removeItem('gargi_customer_id');
      localStorage.removeItem('gargi_customer_role');
      localStorage.removeItem('customer_auth_demo');

      setCustomer(null);
      setRole(null);
      setIsLoggedIn(false);

      broadcastPortalSync('AUTH_CHANGED', { action: 'logout', portal: 'customer' }, currentEmail);

      await supabase.auth.signOut().catch(() => {});
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <CustomerAuthContext.Provider value={{
      customer,
      isLoggedIn,
      role,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      login,
      logout,
      redirectAfterLogin
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth(): CustomerAuthContextType {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

