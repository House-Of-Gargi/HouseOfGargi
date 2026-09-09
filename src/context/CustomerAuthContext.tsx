'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { broadcastPortalSync, subscribeToPortalSync } from '@/lib/realtimeSync';

export interface Customer {
  email: string;
  name?: string;
  id?: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: (redirectUrl?: string) => void;
  closeLoginModal: () => void;
  login: (email: string, name?: string, id?: string) => void;
  logout: () => Promise<void>;
  redirectAfterLogin: string | null;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  // Initialize and synchronize customer session
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem('gargi_customer_email');
      const isDemo = localStorage.getItem('customer_auth_demo') === 'true';

      if (storedEmail) {
        const storedName = localStorage.getItem('gargi_customer_name') || 'Valued Patron';
        const storedId = localStorage.getItem('gargi_customer_id') || undefined;
        setCustomer({ email: storedEmail, name: storedName, id: storedId });
        setIsLoggedIn(true);
      } else if (isDemo) {
        // Fallback for active demo session
        const demoEmail = 'patron@gargisaha.com';
        localStorage.setItem('gargi_customer_email', demoEmail);
        setCustomer({ email: demoEmail, name: 'Valued Patron' });
        setIsLoggedIn(true);
      }

      // Check active Supabase Auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          const userEmail = session.user.email.toLowerCase().trim();
          const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Valued Patron';
          localStorage.setItem('gargi_customer_email', userEmail);
          localStorage.setItem('gargi_customer_name', userName);
          localStorage.setItem('gargi_customer_id', session.user.id);
          setCustomer({ email: userEmail, name: userName, id: session.user.id });
          setIsLoggedIn(true);
        }
      });

      // Listen for live Supabase Auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email) {
          const userEmail = session.user.email.toLowerCase().trim();
          const userName = session.user.user_metadata?.name || 'Valued Patron';
          localStorage.setItem('gargi_customer_email', userEmail);
          localStorage.setItem('gargi_customer_name', userName);
          localStorage.setItem('gargi_customer_id', session.user.id);
          setCustomer({ email: userEmail, name: userName, id: session.user.id });
          setIsLoggedIn(true);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('gargi_customer_email');
          localStorage.removeItem('gargi_customer_name');
          localStorage.removeItem('gargi_customer_id');
          localStorage.removeItem('customer_auth_demo');
          setCustomer(null);
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
        const { action, email, name, id } = message.payload || {};
        if (action === 'login' && email) {
          setCustomer({ email, name: name || 'Valued Patron', id });
          setIsLoggedIn(true);
        } else if (action === 'logout') {
          setCustomer(null);
          setIsLoggedIn(false);
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

  const login = (email: string, name = 'Valued Patron', id?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    localStorage.setItem('gargi_customer_email', cleanEmail);
    localStorage.setItem('gargi_customer_name', name);
    if (id) localStorage.setItem('gargi_customer_id', id);
    localStorage.setItem('customer_auth_demo', 'true');

    setCustomer({ email: cleanEmail, name, id });
    setIsLoggedIn(true);
    closeLoginModal();

    // Broadcast login to all other open tabs in real-time
    broadcastPortalSync('AUTH_CHANGED', { action: 'login', email: cleanEmail, name, id }, cleanEmail);
  };

  const logout = async () => {
    try {
      const currentEmail = customer?.email;
      localStorage.removeItem('gargi_customer_email');
      localStorage.removeItem('gargi_customer_name');
      localStorage.removeItem('gargi_customer_id');
      localStorage.removeItem('customer_auth_demo');
      setCustomer(null);
      setIsLoggedIn(false);

      // Broadcast logout to all other open tabs in real-time
      broadcastPortalSync('AUTH_CHANGED', { action: 'logout' }, currentEmail);

      await supabase.auth.signOut().catch(() => {});
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <CustomerAuthContext.Provider value={{
      customer,
      isLoggedIn,
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
