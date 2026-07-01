import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ArrowRightIcon, UserIcon, CartIcon, WishlistIcon, FileTextIcon, ShieldIcon } from '../../components/Icons';
import '../../account.css';

// SVG Icons specifically for Account Page
const ArrowLeftIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

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

const ShareIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
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

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading || !user) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <div className="account-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-brown)', fontSize: '16px' }}>
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
        <h2 className="account-name">Customer</h2>
        <div className="account-meta">{user.phone}</div>
      </div>

      <div className="account-quick-links">
        <button className="account-quick-link-btn" onClick={() => navigate('/account/orders')}>
          <CartIcon size={24} />
          Your orders
        </button>
        <button className="account-quick-link-btn" onClick={() => navigate('/bespoke')}>
          <RulerIcon size={24} />
          Bespoke
        </button>
        <button className="account-quick-link-btn">
          <HelpIcon size={24} />
          Need help?
        </button>
      </div>

      <div className="account-grid-layout">
        <div className="account-list-section">
          <div className="account-list-title">Your information</div>
          
          <div className="account-list-item">
            <div className="account-list-item-icon"><BookIcon /></div>
            <div className="account-list-item-text">Address book</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={() => navigate('/wishlist')}>
            <div className="account-list-item-icon"><WishlistIcon /></div>
            <div className="account-list-item-text">Your wishlist</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item">
            <div className="account-list-item-icon"><RulerIcon /></div>
            <div className="account-list-item-text">Saved measurements</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>
        </div>

        <div className="account-list-section">
          <div className="account-list-title">Other Information</div>
          
          <div className="account-list-item">
            <div className="account-list-item-icon"><ShareIcon /></div>
            <div className="account-list-item-text">Share the app</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={() => navigate('/our-story')}>
            <div className="account-list-item-icon"><InfoIcon /></div>
            <div className="account-list-item-text">About us</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={() => navigate('/terms')}>
            <div className="account-list-item-icon"><FileTextIcon /></div>
            <div className="account-list-item-text">Terms and Conditions</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={() => navigate('/privacy')}>
            <div className="account-list-item-icon"><ShieldIcon /></div>
            <div className="account-list-item-text">Privacy Policy</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>

          <div className="account-list-item" onClick={handleLogout} style={{ borderTop: '1px solid var(--soft-gold-line)' }}>
            <div className="account-list-item-icon" style={{ color: 'var(--maharani-maroon)' }}><LogOutIcon /></div>
            <div className="account-list-item-text" style={{ color: 'var(--maharani-maroon)' }}>Log out</div>
            <div className="account-list-item-arrow"><ArrowRightIcon size={16} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
