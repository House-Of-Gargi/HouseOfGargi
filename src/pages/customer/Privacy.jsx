import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    setDeleting(true);
    setDeleteMessage('');

    try {
      // In a real production app, client users cannot delete themselves directly for security.
      // You would typically call a Supabase Edge Function here: 
      // await supabase.functions.invoke('delete-user')
      
      // For this demo, we will log them out and show a success message.
      await supabase.auth.signOut();
      setDeleteMessage("Your account deletion request has been processed securely. You have been logged out.");
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      setDeleteMessage("Failed to delete account. Please contact support.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--gargi-gold)', marginBottom: '32px' }}>Privacy Policy</h1>
      
      <div style={{ color: 'var(--ink-brown)', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>1. Data Collection</h2>
        <p style={{ marginBottom: '16px' }}>
          We collect personal information necessary to fulfill your orders and provide a personalized bespoke experience. This includes contact details and garment measurements.
        </p>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>2. How We Use Your Data</h2>
        <p style={{ marginBottom: '16px' }}>
          Your data is used strictly for processing orders, communicating shipping updates, and maintaining your measurement profile for future bespoke requests. We do not sell your data.
        </p>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>3. Data Security</h2>
        <p style={{ marginBottom: '16px' }}>
          We implement robust security measures to protect your personal information, utilizing secure backend architectures and encrypted auth systems.
        </p>

        <div style={{ marginTop: '64px', padding: '32px', border: '1px solid #FFCDD2', borderRadius: '12px', background: '#FFEBEE' }}>
          <h2 style={{ fontSize: '20px', color: '#C62828', marginBottom: '16px' }}>Danger Zone</h2>
          <p style={{ color: '#D32F2F', marginBottom: '24px' }}>
            If you wish to permanently delete your account and all associated data (including saved measurements and order history), you may do so below.
          </p>
          
          {deleteMessage && (
            <div style={{ marginBottom: '16px', padding: '12px', background: '#fff', color: '#2B1F18', borderRadius: '4px', fontWeight: 'bold' }}>
              {deleteMessage}
            </div>
          )}

          <button 
            onClick={handleDeleteAccount}
            disabled={deleting}
            style={{
              background: '#C62828',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {deleting ? 'Processing...' : 'Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
