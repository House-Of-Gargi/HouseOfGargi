'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Customer {
  phone: string;
  name?: string;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: (redirectUrl?: string) => void;
  closeLoginModal: () => void;
  login: (phone: string, name?: string) => void;
  logout: () => Promise<void>;
  redirectAfterLogin: string | null;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedPhone = localStorage.getItem('gargi_customer_phone');
      const isDemo = localStorage.getItem('customer_auth_demo') === 'true';

      if (storedPhone) {
        const storedName = localStorage.getItem('gargi_customer_name') || 'Valued Patron';
        setCustomer({ phone: storedPhone, name: storedName });
        setIsLoggedIn(true);
      } else if (isDemo) {
        // Fallback for demo session
        const demoPhone = '9876543210';
        localStorage.setItem('gargi_customer_phone', demoPhone);
        setCustomer({ phone: demoPhone, name: 'Valued Patron' });
        setIsLoggedIn(true);
      }

      // Sync Supabase Auth session if active
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.phone) {
          const rawPhone = session.user.phone.replace(/^\+91/, '').replace(/\D/g, '');
          if (rawPhone) {
            localStorage.setItem('gargi_customer_phone', rawPhone);
            setCustomer({ phone: rawPhone, name: session.user.user_metadata?.name || 'Valued Patron' });
            setIsLoggedIn(true);
          }
        }
      });
    } catch (e) {
      console.warn('Failed reading customer auth state:', e);
    }
    setInitialized(true);
  }, []);

  const openLoginModal = (redirectUrl?: string) => {
    if (redirectUrl) setRedirectAfterLogin(redirectUrl);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setRedirectAfterLogin(null);
  };

  const login = (phone: string, name = 'Valued Patron') => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    localStorage.setItem('gargi_customer_phone', cleanPhone);
    localStorage.setItem('gargi_customer_name', name);
    localStorage.setItem('customer_auth_demo', 'true');
    setCustomer({ phone: cleanPhone, name });
    setIsLoggedIn(true);
    closeLoginModal();
  };

  const logout = async () => {
    try {
      localStorage.removeItem('gargi_customer_phone');
      localStorage.removeItem('gargi_customer_name');
      localStorage.removeItem('customer_auth_demo');
      setCustomer(null);
      setIsLoggedIn(false);
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
