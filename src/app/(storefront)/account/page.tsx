'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRightIcon, UserIcon, CartIcon, WishlistIcon, FileTextIcon, ShieldIcon } from '@/components/Icons';

const HelpIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const BookIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const RulerIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.3 15.3l-7.6 7.6a2 2 0 0 1-2.8 0l-7.6-7.6a2 2 0 0 1 0-2.8l7.6-7.6a2 2 0 0 1 2.8 0l7.6 7.6a2 2 0 0 1 0 2.8z"></path>
    <path d="M14.5 10.5l-3 3"></path>
    <path d="M10.5 6.5l-3 3"></path>
    <path d="M18.5 14.5l-3 3"></path>
  </svg>
);

const InfoIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const LogOutIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

import { useCustomerAuth } from '@/context/CustomerAuthContext';

export default function AccountPage() {
  const router = useRouter();
  const { customer, isLoggedIn, logout } = useCustomerAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/');
    }
  }, [mounted, isLoggedIn, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!mounted || !isLoggedIn || !customer) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading profile...
      </div>
    );
  }

  const formattedPhone = customer.phone.length === 10
    ? `+91 ${customer.phone.slice(0, 5)} ${customer.phone.slice(5)}`
    : `+91 ${customer.phone}`;

  return (
    <div className="account-container" style={{ paddingTop: 'calc(var(--navbar-height) + 32px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-brown)', fontSize: '16px' }}>
          <span>&larr;</span> Back
        </button>
      </div>
      <div style={{ textAlign: 'left', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', margin: 0, fontSize: '28px' }}>Profile</h1>
      </div>

      <div className="account-profile-card">
        <div className="account-avatar">
          <UserIcon size={40} />
        </div>
        <h2 className="account-name">{customer.name || 'Patron of Craft'}</h2>
        <div className="account-meta">{formattedPhone}</div>
      </div>

      <div className="account-quick-links">
        <button type="button" className="account-quick-link-btn" onClick={() => router.push('/cart')}>
          <CartIcon size={24} />
          Shopping bag
        </button>
        <button type="button" className="account-quick-link-btn" onClick={() => router.push('/bespoke')}>
          <RulerIcon size={24} />
          Bespoke
        </button>
        <button type="button" className="account-quick-link-btn" onClick={() => router.push('/faq')}>
          <HelpIcon size={24} />
          Client Care
        </button>
      </div>

      <div className="account-grid-layout">
        <div className="account-list-section">
          <div className="account-list-title">Your Information</div>
          
          <div className="account-list-item" onClick={() => router.push('/wishlist')}>
            <div className="account-list-item-icon"><WishlistIcon /></div>
            <div className="account-list-item-text">Your Wishlist</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={() => router.push('/size-guide')}>
            <div className="account-list-item-icon"><RulerIcon /></div>
            <div className="account-list-item-text">Size Guide & Measurements</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={() => router.push('/shipping')}>
            <div className="account-list-item-icon"><BookIcon /></div>
            <div className="account-list-item-text">Shipping & Logistics</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>
        </div>

        <div className="account-list-section">
          <div className="account-list-title">Boutique & Policies</div>

          <div className="account-list-item" onClick={() => router.push('/our-story')}>
            <div className="account-list-item-icon"><InfoIcon /></div>
            <div className="account-list-item-text">Our Story</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={() => router.push('/terms')}>
            <div className="account-list-item-icon"><FileTextIcon /></div>
            <div className="account-list-item-text">Terms & Conditions</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={() => router.push('/privacy')}>
            <div className="account-list-item-icon"><ShieldIcon /></div>
            <div className="account-list-item-text">Privacy Policy</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={handleLogout} style={{ borderTop: '1px solid var(--soft-gold-line)' }}>
            <div className="account-list-item-icon" style={{ color: 'var(--maharani-maroon)' }}><LogOutIcon /></div>
            <div className="account-list-item-text" style={{ color: 'var(--maharani-maroon)' }}>Sign Out</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
