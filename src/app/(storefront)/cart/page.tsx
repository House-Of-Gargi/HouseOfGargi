'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { DiyaIcon, PlusIcon, MinusIcon, CloseIcon } from '@/components/Icons';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, itemCount, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (cart.length === 0 && !checkoutSuccess) {
    return (
      <div className="section section--ivory" style={{ minHeight: '60vh', paddingTop: 'calc(var(--navbar-height) + 40px)', textAlign: 'center' }}>
        <div className="container">
          <DiyaIcon size={48} style={{ color: 'var(--gargi-gold)', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', marginBottom: '16px' }}>Your Shopping Bag is Empty</h1>
          <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>Explore our exquisite collections to find something beautiful.</p>
          <Link href="/shop" className="btn btn--primary">Discover Collections</Link>
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
        <div className="container" style={{ maxWidth: '600px' }}>
          <DiyaIcon size={56} style={{ color: 'var(--gargi-gold)', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--maharani-maroon)', marginBottom: '16px' }}>Order Received</h1>
          <p style={{ fontSize: '18px', color: 'var(--ink-brown)', marginBottom: '12px' }}>
            Thank you, <strong>{customerName}</strong>! Your heirloom piece is being carefully prepared.
          </p>
          <div style={{ background: 'var(--pure-white)', padding: '24px', borderRadius: '8px', border: '1px solid var(--soft-gold-line)', margin: '24px 0' }}>
            <p className="caption">Your Order Number</p>
            <h2 style={{ color: 'var(--gargi-gold)', margin: '8px 0' }}>{checkoutSuccess}</h2>
            <p style={{ fontSize: '14px', color: 'var(--stone-taupe)' }}>
              We will notify you on <strong>+91 {customerPhone}</strong> with shipment updates.
            </p>
          </div>
          <Link href="/" className="btn btn--primary">Return to Boutique</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', paddingTop: 'calc(var(--navbar-height) + 24px)' }}>
      <div className="container">
        <h1 style={{ fontFamily: 'var(--font-nav)', marginBottom: '32px' }}>
          Shopping Bag ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {cart.map((item) => (
              <div 
                key={`${item.id}-${item.size}`} 
                className="cart-item-card styled-box"
                style={{ position: 'relative' }}
              >
                <Link href={`/product/${item.id}`} style={{ width: '100px', flexShrink: 0 }}>
                  <img 
                    src={item.images[0]} 
                    alt={item.name} 
                    style={{ width: '100px', height: '133px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </Link>

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '32px' }}>
                    <Link href={`/product/${item.id}`} style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600 }}>
                      {item.name}
                    </Link>
                    <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>

                  <p className="caption" style={{ margin: '4px 0 12px' }}>
                    Size: <strong>{item.size || 'Free Size'}</strong> • {item.fabric}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--soft-gold-line)', borderRadius: '2px', background: 'var(--pure-white)' }}>
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        style={{ padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '14px', fontWeight: 600 }}>{item.quantity}</span>
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        style={{ padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                        aria-label="Increase quantity"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.size)}
                      style={{ background: 'none', border: 'none', color: 'var(--stone-taupe)', fontSize: '13px', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id, item.size)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
                  aria-label="Remove item"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary & Checkout Card */}
          <div className="styled-box" style={{ padding: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-nav)', marginBottom: '24px', fontSize: '20px' }}>Order Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--stone-taupe)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--soft-gold-line)' }}>
              <span style={{ color: 'var(--stone-taupe)' }}>Shipping (India & Global)</span>
              <span style={{ color: 'var(--peacock-teal)', fontWeight: 600 }}>Complimentary</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--maharani-maroon)' }}>
                {formatPrice(subtotal)}
              </span>
            </div>

            <form onSubmit={handleCheckout}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--stone-taupe)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--soft-gold-line)', borderRadius: '4px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--stone-taupe)', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--soft-gold-line)', borderRadius: '4px', outline: 'none' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn--primary" 
                style={{ width: '100%', padding: '16px' }}
                disabled={checkingOut}
              >
                {checkingOut ? 'Securing Order...' : 'Proceed to Checkout'}
              </button>
            </form>

            <p className="caption" style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px' }}>
              🔒 256-bit encrypted secure checkout. Authentic heirloom guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
