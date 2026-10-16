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

  // Initialize and synchronize session across all 3 portals
  useEffect(() => {
    try {
      // 1. Check direct customer login
      const storedCustomerEmail = localStorage.getItem('gargi_customer_email');
      const storedCustomerRole = localStorage.getItem('gargi_customer_role') as AppRole | null;
      const isDemo = localStorage.getItem('customer_auth_demo') === 'true';

      // 2. Check admin / super admin / artisan sessions in localStorage
      let detectedEmail: string | null = null;
      let detectedRole: AppRole | null = null;
      let detectedName: string | null = null;
      let detectedId: string | null = null;

      const superAdminStored = localStorage.getItem('super_admin_session');
      if (superAdminStored) {
        try {
          const parsed = JSON.parse(superAdminStored);
          if (parsed.email) {
            detectedEmail = parsed.email;
            detectedRole = 'super_admin';
            detectedName = parsed.name || 'Super Admin';
          }
        } catch {}
      }

      if (!detectedEmail) {
        const adminStored = localStorage.getItem('admin_session');
        if (adminStored) {
          try {
            const parsed = JSON.parse(adminStored);
            if (parsed.email) {
              detectedEmail = parsed.email;
              detectedRole = (parsed.role as AppRole) || 'admin';
              detectedName = parsed.name || 'Administrator';
            }
          } catch {}
        }
      }

      if (!detectedEmail) {
        const artisanStored = localStorage.getItem('artisan_session');
        if (artisanStored) {
          try {
            const parsed = JSON.parse(artisanStored);
            if (parsed.email) {
              detectedEmail = parsed.email;
              detectedRole = 'artisan';
              detectedName = parsed.name || 'Master Artisan';
            }
          } catch {}
        }
      }

      if (detectedEmail && detectedRole) {
        setCustomer({ email: detectedEmail, name: detectedName || 'Team Member', role: detectedRole });
        setRole(detectedRole);
        setIsLoggedIn(true);
      } else if (storedCustomerEmail) {
        const storedName = localStorage.getItem('gargi_customer_name') || 'Valued Patron';
        const storedId = localStorage.getItem('gargi_customer_id') || undefined;
        setCustomer({ email: storedCustomerEmail, name: storedName, id: storedId, role: storedCustomerRole || 'patron' });
        setRole(storedCustomerRole || 'patron');
        setIsLoggedIn(true);

        getUserRole(storedCustomerEmail).then((r) => {
          setRole(r);
          localStorage.setItem('gargi_customer_role', r);
          setCustomer((prev) => (prev ? { ...prev, role: r } : null));
        });
      } else if (isDemo) {
        const demoEmail = 'patron@gargisaha.com';
        localStorage.setItem('gargi_customer_email', demoEmail);
        localStorage.setItem('gargi_customer_role', 'patron');
        setCustomer({ email: demoEmail, name: 'Valued Patron', role: 'patron' });
        setRole('patron');
        setIsLoggedIn(true);
      }

      // Check active Supabase Auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          const userEmail = session.user.email.toLowerCase().trim();
          const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'Valued Patron';
          
          getUserRole(userEmail).then((resolvedRole) => {
            setRole(resolvedRole);
            setCustomer({ email: userEmail, name: userName, id: session.user.id, role: resolvedRole });
            setIsLoggedIn(true);
            localStorage.setItem('gargi_customer_email', userEmail);
            localStorage.setItem('gargi_customer_name', userName);
            localStorage.setItem('gargi_customer_id', session.user.id);
            localStorage.setItem('gargi_customer_role', resolvedRole);
          });
        }
      });

      // Listen for live Supabase Auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email) {
          const userEmail = session.user.email.toLowerCase().trim();
          const userName = session.user.user_metadata?.name || 'Valued Patron';
          getUserRole(userEmail).then((resolvedRole) => {
            setRole(resolvedRole);
            setCustomer({ email: userEmail, name: userName, id: session.user.id, role: resolvedRole });
            setIsLoggedIn(true);
            localStorage.setItem('gargi_customer_email', userEmail);
            localStorage.setItem('gargi_customer_name', userName);
            localStorage.setItem('gargi_customer_id', session.user.id);
            localStorage.setItem('gargi_customer_role', resolvedRole);
          });
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
        const { action, email, name, id, role: syncRole } = message.payload || {};
        if (action === 'login' && email) {
          const activeRole = syncRole || 'patron';
          setCustomer({ email, name: name || 'Valued Patron', id, role: activeRole });
          setRole(activeRole);
          setIsLoggedIn(true);
        } else if (action === 'logout') {
          setCustomer(null);
          setRole(null);
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

  const login = (email: string, name = 'Valued Patron', id?: string, explicitRole?: AppRole) => {
    const cleanEmail = email.toLowerCase().trim();
    localStorage.setItem('gargi_customer_email', cleanEmail);
    localStorage.setItem('gargi_customer_name', name);
    if (id) localStorage.setItem('gargi_customer_id', id);
    localStorage.setItem('customer_auth_demo', 'true');

    if (explicitRole) {
      localStorage.setItem('gargi_customer_role', explicitRole);
      setRole(explicitRole);
      setCustomer({ email: cleanEmail, name, id, role: explicitRole });
      setIsLoggedIn(true);
      closeLoginModal();
      broadcastPortalSync('AUTH_CHANGED', { action: 'login', email: cleanEmail, name, id, role: explicitRole }, cleanEmail);
    } else {
      getUserRole(cleanEmail).then((resRole) => {
        localStorage.setItem('gargi_customer_role', resRole);
        setRole(resRole);
        setCustomer({ email: cleanEmail, name, id, role: resRole });
        setIsLoggedIn(true);
        closeLoginModal();
        broadcastPortalSync('AUTH_CHANGED', { action: 'login', email: cleanEmail, name, id, role: resRole }, cleanEmail);
      });
    }
  };

  const logout = async () => {
    try {
      const currentEmail = customer?.email;
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

      localStorage.removeItem('gargi_customer_email');
      localStorage.removeItem('gargi_customer_name');
      localStorage.removeItem('gargi_customer_id');
      localStorage.removeItem('gargi_customer_role');
      localStorage.removeItem('customer_auth_demo');
      localStorage.removeItem('artisan_session');
      localStorage.removeItem('admin_session');
      localStorage.removeItem('super_admin_session');
      localStorage.removeItem('auth_session');

      setCustomer(null);
      setRole(null);
      setIsLoggedIn(false);

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

