'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { DiyaIcon, PlusIcon, MinusIcon, CloseIcon } from '@/components/Icons';
import { getProduct } from '@/data/products';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, itemCount, clearCart } = useCart();
  const { formatPrice, config } = useCurrency();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (cart.length === 0 && !checkoutSuccess) {
    return (
      <div className="section section--ivory" style={{ minHeight: '65vh', paddingTop: 'calc(var(--navbar-height) + 60px)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <DiyaIcon size={48} style={{ color: 'var(--gargi-gold)', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink-brown)', fontSize: '36px', fontWeight: 600, marginBottom: '16px' }}>
            Your Shopping Bag is Empty
          </h1>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '16.5px', lineHeight: 1.7, marginBottom: '32px' }}>
            Explore our curated collections of pure silk sarees, bridal lehengas, and handcrafted jewellery.
          </p>
          <Link href="/shop" className="btn btn--primary" style={{ padding: '15px 36px', fontSize: '15px' }}>
            Discover Collections
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setCheckingOut(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setCheckoutSuccess(data.order.order_number);
        clearCart();
      } else {
        alert('Checkout error: ' + (data.error || 'Failed to place order'));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to checkout service.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="section section--ivory" style={{ minHeight: '70vh', paddingTop: 'calc(var(--navbar-height) + 60px)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <DiyaIcon size={56} style={{ color: 'var(--gargi-gold)', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--maharani-maroon)', fontSize: '36px', fontWeight: 600, marginBottom: '16px' }}>
            Commission Received
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--ink-brown)', marginBottom: '12px', lineHeight: 1.6 }}>
            Thank you, <strong>{customerName}</strong>. Your heirloom piece is being carefully prepared by our master weavers.
          </p>
          <div style={{ background: 'var(--pure-white)', padding: '28px', borderRadius: '6px', border: '1.5px solid var(--soft-gold-line)', margin: '28px 0', boxShadow: '0 8px 30px rgba(43, 31, 24, 0.04)' }}>
            <p className="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Your Order Reference</p>
            <h2 style={{ color: 'var(--gargi-gold)', margin: '10px 0', fontSize: '28px', fontFamily: 'var(--font-display)' }}>{checkoutSuccess}</h2>
            <p style={{ fontSize: '15px', color: 'var(--stone-taupe)', margin: 0 }}>
              We will notify you on <strong>+91 {customerPhone}</strong> with shipment updates and artisanal progress.
            </p>
          </div>
          <Link href="/" className="btn btn--primary" style={{ padding: '14px 32px' }}>Return to Boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section section--ivory" style={{ minHeight: '85vh', paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '1240px', padding: '0 24px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            type="button" 
            onClick={() => router.back()} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--stone-taupe)', 
              fontFamily: 'var(--font-nav)',
              fontSize: '13.5px', 
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'color 200ms ease',
            }}
          >
            <span style={{ fontSize: '16px' }}>&larr;</span> Back to Shopping
          </button>
        </div>

        {/* Page Header (Clean, spacious, without any intrusive pill badge) */}
        <div style={{ 
          marginBottom: '48px', 
          borderBottom: '1px solid var(--soft-gold-line)', 
          paddingBottom: '24px' 
        }}>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(32px, 4vw, 42px)', 
            fontWeight: 600, 
            color: 'var(--ink-brown)', 
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Shopping Bag
          </h1>
          <p style={{ color: 'var(--stone-taupe)', fontSize: '16.5px', marginTop: '8px', fontWeight: 500 }}>
            {itemCount} {itemCount === 1 ? 'handcrafted piece' : 'handcrafted pieces'} reserved in your private bag
          </p>
        </div>

        {/* Spacious 2-Column Grid */}
        <div className="cart-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '48px', alignItems: 'start' }}>
          {/* Left Column: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {cart.map((item) => {
              const fresh = getProduct(item.id);
              const displayImage = fresh?.images?.[0] || item.images?.[0];
              const displayName = fresh?.name || item.name;
              const displayFabric = fresh?.fabric || item.fabric;
              return (
              <div 
                key={`${item.id}-${item.size}`} 
                className="cart-item-card"
                style={{ position: 'relative' }}
              >
                {/* Product Image Thumbnail — Generous 130px x 170px luxury presentation */}
                <Link href={`/product/${item.id}`} style={{ width: '130px', flexShrink: 0 }}>
                  <img 
                    src={displayImage} 
                    alt={displayName} 
                    style={{ 
                      width: '130px', 
                      height: '170px', 
                      objectFit: 'cover', 
                      borderRadius: '4px',
                      border: '1px solid var(--soft-gold-line)',
                      background: '#F5F0E8'
                    }}
                  />
                </Link>

                {/* Content Body */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  {/* Title & Price Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', paddingRight: '28px' }}>
                    <div>
                      <Link 
                        href={`/product/${item.id}`} 
                        style={{ 
                          fontFamily: 'var(--font-display)', 
                          fontSize: '22px', 
                          fontWeight: 600, 
                          color: 'var(--ink-brown)',
                          lineHeight: 1.3,
                          display: 'inline-block'
                        }}
                      >
                        {displayName}
                      </Link>
                      <p style={{ margin: '6px 0 0', fontSize: '14.5px', color: 'var(--stone-taupe)', fontWeight: 500 }}>
                        Size: <strong style={{ color: 'var(--ink-brown)' }}>{item.size || 'Free Size'}</strong> • {displayFabric}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ 
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700, 
                        fontSize: '20px', 
                        color: 'var(--maharani-maroon)',
                        display: 'block'
                      }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span style={{ fontSize: '13px', color: 'var(--stone-taupe)', marginTop: '2px', display: 'block' }}>
                          ({formatPrice(item.price)} each)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row: Quantity Stepper & Remove */}
                  <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid var(--soft-gold-line)', borderRadius: '4px', background: 'var(--pure-white)' }}>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        style={{ padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span style={{ padding: '0 12px', fontSize: '15.5px', fontWeight: 600, color: 'var(--ink-brown)' }}>
                        {item.quantity}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        style={{ padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                        aria-label="Increase quantity"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.size)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--stone-taupe)', 
                        fontSize: '13.5px', 
                        cursor: 'pointer', 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        padding: '4px 8px',
                        transition: 'color 200ms ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--maharani-maroon)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--stone-taupe)'}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>

                {/* Top-Right Quick Remove Cross */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id, item.size)}
                  style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: 'var(--stone-taupe)',
                    padding: '4px',
                    lineHeight: 1,
                    transition: 'color 200ms ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--maharani-maroon)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--stone-taupe)'}
                  aria-label="Remove item"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Order Summary & Checkout Card */}
          <div 
            className="styled-box" 
            style={{ 
              position: 'sticky', 
              top: 'calc(var(--navbar-height) + 24px)',
              padding: '36px 32px' 
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px', fontSize: '24px', fontWeight: 600, color: 'var(--ink-brown)' }}>
              Order Summary
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--stone-taupe)', marginBottom: '24px' }}>
              Complimentary insured worldwide delivery
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '15.5px' }}>
              <span style={{ color: 'var(--stone-taupe)' }}>Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--ink-brown)' }}>{formatPrice(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '15.5px' }}>
              <span style={{ color: 'var(--stone-taupe)' }}>Shipping (India &amp; Global)</span>
              <span style={{ color: 'var(--peacock-teal)', fontWeight: 700 }}>Complimentary</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid var(--soft-gold-line)', fontSize: '15.5px' }}>
              <span style={{ color: 'var(--stone-taupe)' }}>Atelier Keepsake Packaging</span>
              <span style={{ color: 'var(--peacock-teal)', fontWeight: 700 }}>Complimentary</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
              <span style={{ fontFamily: 'var(--font-nav)', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-brown)' }}>
                Total
              </span>
              <span style={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '28px', 
                fontWeight: 700, 
                color: 'var(--maharani-maroon)',
                letterSpacing: '-0.02em'
              }}>
                {formatPrice(subtotal)}
              </span>
            </div>

            <form onSubmit={handleCheckout}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-nav)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--stone-taupe)', marginBottom: '8px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    fontSize: '15.5px', 
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    color: 'var(--ink-brown)',
                    background: 'var(--pure-white)',
                    border: '1.5px solid var(--soft-gold-line)', 
                    borderRadius: '4px', 
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(43, 31, 24, 0.03)',
                    transition: 'border-color 200ms ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gargi-gold)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--soft-gold-line)'}
                />
              </div>

              <div style={{ marginBottom: '26px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontFamily: 'var(--font-nav)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--stone-taupe)', marginBottom: '8px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    fontSize: '15.5px', 
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    color: 'var(--ink-brown)',
                    background: 'var(--pure-white)',
                    border: '1.5px solid var(--soft-gold-line)', 
                    borderRadius: '4px', 
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(43, 31, 24, 0.03)',
                    transition: 'border-color 200ms ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gargi-gold)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--soft-gold-line)'}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn--primary" 
                style={{ 
                  width: '100%', 
                  padding: '16px 24px', 
                  fontSize: '14.5px', 
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 16px rgba(122, 35, 49, 0.2)'
                }}
                disabled={checkingOut}
              >
                {checkingOut ? 'Securing Order...' : 'Proceed to Checkout →'}
              </button>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--soft-gold-line)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--stone-taupe)' }}>
                <span style={{ color: 'var(--gargi-gold)', fontWeight: 700 }}>✓</span> 256-Bit SSL Encrypted Checkout
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--stone-taupe)' }}>
                <span style={{ color: 'var(--gargi-gold)', fontWeight: 700 }}>✓</span> 100% Certified Handcrafted Weaves
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--stone-taupe)' }}>
                <span style={{ color: 'var(--gargi-gold)', fontWeight: 700 }}>✓</span> White-Glove Insured Global Transit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
