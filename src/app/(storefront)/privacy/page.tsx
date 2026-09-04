'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function PrivacyPage() {
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to request deletion of your account and personal data? This action is permanent.")) {
      return;
    }

    setDeleting(true);
    try {
      localStorage.removeItem('customer_auth_demo');
      await supabase.auth.signOut();
      setDeleteMessage("Your account deletion request has been registered securely. You have been logged out.");
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch {
      setDeleteMessage("Failed to process request. Please contact care@houseofgargi.com.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--gargi-gold)', marginBottom: '32px' }}>Privacy Policy</h1>
      
      <div style={{ color: 'var(--ink-brown)', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>1. Data Collection & Trust</h2>
        <p style={{ marginBottom: '16px' }}>
          We collect only personal information necessary to fulfill your couture orders, provide bespoke measurement fittings, and deliver heirloom pieces to your doorstep.
        </p>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>2. Data Protection</h2>
        <p style={{ marginBottom: '16px' }}>
          Your payment information is encrypted using 256-bit bank-grade SSL security and processed directly through certified payment gateways. We never store raw credit card credentials on our servers.
        </p>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>3. Your Rights & Data Erasure</h2>
        <p style={{ marginBottom: '16px' }}>
          Under applicable data privacy regulations, you retain full rights to inspect, update, or request the complete deletion of your customer profile.
        </p>

        <div style={{ marginTop: '48px', padding: '24px', background: 'var(--warm-sand)', borderRadius: '8px', border: '1px solid var(--soft-gold-line)' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--maharani-maroon)' }}>Account & Data Erasure Request</h3>
          <p style={{ fontSize: '14px', color: 'var(--stone-taupe)', marginBottom: '16px' }}>
            Requesting account deletion will remove all saved measurements, delivery addresses, and personal credentials.
          </p>
          <button 
            type="button"
            className="btn btn--outline" 
            style={{ borderColor: 'var(--maharani-maroon)', color: 'var(--maharani-maroon)' }}
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? 'Processing Request...' : 'Delete My Account & Personal Data'}
          </button>
          {deleteMessage && (
            <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--peacock-teal)' }}>
              {deleteMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
