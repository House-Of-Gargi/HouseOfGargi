'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Ruler, 
  Truck, 
  FileText, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen 
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { customer, isLoggedIn, logout } = useCustomerAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
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
      <div className="account-page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '65vh' }}>
        <p style={{ fontFamily: 'var(--font-nav)', fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--stone-taupe)' }}>
          Loading Patron Profile...
        </p>
      </div>
    );
  }

  const formattedPhone = customer.phone.length === 10
    ? `+91 ${customer.phone.slice(0, 5)} ${customer.phone.slice(5)}`
    : `+91 ${customer.phone}`;

  return (
    <div className="account-page-wrap">
      <div className="account-container">
        {/* Top Navigation & Back */}
        <div className="account-top-bar">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="account-back-btn"
          >
            <ArrowLeft size={16} /> Back to Browsing
          </button>
        </div>

        {/* Page Header */}
        <div className="account-header-row">
          <div className="account-eyebrow">House of Gargi • Personal Client Suite</div>
          <h1 className="account-title">Patron Atelier Profile</h1>
        </div>

        {/* Expansive 2-Column Responsive Dashboard Layout */}
        <div className="account-layout-grid">
          
          {/* Left Column: Patron Identity & Account Actions */}
          <aside className="account-sidebar-card">
            <div className="account-avatar">
              <User size={34} strokeWidth={1.3} />
            </div>
            <h2 className="account-patron-name">{customer.name || 'Valued Patron'}</h2>
            <div className="account-patron-phone">
              <span>{formattedPhone}</span>
            </div>

            {/* Quick Live Summary Stats */}
            <div className="account-sidebar-stats">
              <Link href="/cart" className="account-stat-block">
                <span className="account-stat-number">{itemCount}</span>
                <span className="account-stat-label">In Bag</span>
              </Link>
              <Link href="/wishlist" className="account-stat-block">
                <span className="account-stat-number">{wishlistCount}</span>
                <span className="account-stat-label">Wishlist</span>
              </Link>
            </div>

            {/* Direct Sign Out */}
            <button 
              type="button" 
              onClick={handleLogout} 
              className="account-logout-btn"
            >
              <LogOut size={16} strokeWidth={1.75} /> Sign Out of Atelier
            </button>
          </aside>

          {/* Right Column: Full-Width Atelier Services & Guides */}
          <main className="account-main-content">
            
            {/* 1. Active Curations & Inquiries */}
            <section>
              <div className="account-section-header">
                <span className="account-section-tag">Active Curations &amp; Commissions</span>
              </div>
              <div className="account-curations-grid">
                
                {/* Shopping Bag Card */}
                <Link href="/cart" className="account-curation-card">
                  <div>
                    <div className="account-curation-icon-wrap">
                      <ShoppingBag size={24} strokeWidth={1.3} />
                    </div>
                    <h3 className="account-curation-title">Shopping Bag</h3>
                    <p className="account-curation-desc">
                      {itemCount > 0 
                        ? `${itemCount} ${itemCount === 1 ? 'piece' : 'pieces'} reserved for checkout.`
                        : 'Your reserved pieces and checkout bag.'}
                    </p>
                  </div>
                  <span className="account-curation-action">
                    Open Shopping Bag <ArrowRight size={14} />
                  </span>
                </Link>

                {/* Wishlist Card */}
                <Link href="/wishlist" className="account-curation-card">
                  <div>
                    <div className="account-curation-icon-wrap">
                      <Heart size={24} strokeWidth={1.3} />
                    </div>
                    <h3 className="account-curation-title">Heirloom Wishlist</h3>
                    <p className="account-curation-desc">
                      {wishlistCount > 0
                        ? `${wishlistCount} saved ${wishlistCount === 1 ? 'piece' : 'pieces'} in your registry.`
                        : 'Saved favorites and curated registry.'}
                    </p>
                  </div>
                  <span className="account-curation-action">
                    View Wishlist <ArrowRight size={14} />
                  </span>
                </Link>

                {/* Bespoke Inquiry Card */}
                <Link href="/bespoke" className="account-curation-card">
                  <div>
                    <div className="account-curation-icon-wrap">
                      <Sparkles size={24} strokeWidth={1.3} />
                    </div>
                    <h3 className="account-curation-title">Bespoke Couture</h3>
                    <p className="account-curation-desc">
                      Custom bridal commissions and private atelier tailoring.
                    </p>
                  </div>
                  <span className="account-curation-action">
                    Commission Bespoke <ArrowRight size={14} />
                  </span>
                </Link>

              </div>
            </section>

            {/* 2. Patron Guides & Craft Specifications */}
            <section>
              <div className="account-section-header">
                <span className="account-section-tag">Atelier Guidance &amp; Logistics</span>
              </div>
              <div className="account-guides-grid">
                
                {/* Size & Measurements */}
                <Link href="/size-guide" className="account-guide-card">
                  <div className="account-guide-icon">
                    <Ruler size={22} strokeWidth={1.4} />
                  </div>
                  <div className="account-guide-body">
                    <h4 className="account-guide-title">Measurements &amp; Fit Guide</h4>
                    <p className="account-guide-desc">
                      Sizing charts for blouses, lehengas, and drape lengths.
                    </p>
                    <span className="account-guide-link">
                      Review Fit Guide <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>

                {/* Insured White-Glove Shipping */}
                <Link href="/shipping" className="account-guide-card">
                  <div className="account-guide-icon">
                    <Truck size={22} strokeWidth={1.4} />
                  </div>
                  <div className="account-guide-body">
                    <h4 className="account-guide-title">White-Glove Logistics</h4>
                    <p className="account-guide-desc">
                      Insured global delivery, luxury packaging, and tracking.
                    </p>
                    <span className="account-guide-link">
                      Shipping Protocols <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>

              </div>
            </section>

            {/* 3. Boutique Heritage & House Policies */}
            <section>
              <div className="account-section-header">
                <span className="account-section-tag">Boutique Heritage &amp; Policies</span>
              </div>
              <div className="account-policies-card">
                
                <Link href="/our-story" className="account-policy-item">
                  <div className="account-policy-left">
                    <span className="account-policy-icon"><BookOpen size={18} strokeWidth={1.4} /></span>
                    <span className="account-policy-title">Our Story &amp; Master Artisan Lineage</span>
                  </div>
                  <span className="account-policy-arrow"><ArrowRight size={16} /></span>
                </Link>

                <Link href="/terms" className="account-policy-item">
                  <div className="account-policy-left">
                    <span className="account-policy-icon"><FileText size={18} strokeWidth={1.4} /></span>
                    <span className="account-policy-title">Terms of Commission &amp; Authenticity Guarantee</span>
                  </div>
                  <span className="account-policy-arrow"><ArrowRight size={16} /></span>
                </Link>

                <Link href="/privacy" className="account-policy-item">
                  <div className="account-policy-left">
                    <span className="account-policy-icon"><ShieldCheck size={18} strokeWidth={1.4} /></span>
                    <span className="account-policy-title">Patron Privacy &amp; Data Sovereignty</span>
                  </div>
                  <span className="account-policy-arrow"><ArrowRight size={16} /></span>
                </Link>

                <Link href="/faq" className="account-policy-item">
                  <div className="account-policy-left">
                    <span className="account-policy-icon"><HelpCircle size={18} strokeWidth={1.4} /></span>
                    <span className="account-policy-title">Client Concierge &amp; Frequently Asked Questions</span>
                  </div>
                  <span className="account-policy-arrow"><ArrowRight size={16} /></span>
                </Link>

              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
