import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/products';
import { DiyaIcon, PlusIcon, MinusIcon, CloseIcon } from '../../components/Icons';
import useSEO from '../../hooks/useSEO';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  useSEO({ title: 'Shopping Bag', description: 'View your House of Gargi shopping bag.' });

  if (cart.length === 0) {
    return (
      <div className="section section--ivory" style={{ minHeight: '60vh', paddingTop: 'calc(var(--navbar-height) + 40px)', textAlign: 'center' }}>
        <div className="container">
          <DiyaIcon size={48} style={{ color: 'var(--gargi-gold)', marginBottom: '24px' }} />
          <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', marginBottom: '16px' }}>Your Bag is Empty</h1>
          <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>Explore our exquisite collections to find something beautiful.</p>
          <Link to="/" className="btn btn--primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', paddingTop: 'calc(var(--navbar-height) + 16px)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-brown)', fontSize: '16px' }}>
            <span>&larr;</span> Back
          </button>
        </div>
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', marginBottom: '8px', fontSize: '28px' }}>
            Shopping Bag <span style={{ fontSize: '18px', color: 'var(--stone-taupe)', fontWeight: 'normal' }}>({itemCount} items)</span>
          </h1>
        </div>

        <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: '1fr 340px' }} className="cart-layout">
          {/* Cart Items */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${idx}`} style={{ display: 'flex', gap: '24px', padding: '24px', background: 'var(--pure-white)', border: '1px solid var(--soft-gold-line)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(43,31,24,0.05)' }}>
                  <Link to={`/product/${item.id}`} style={{ flexShrink: 0 }}>
                    <img src={item.images[0]} alt={item.name} style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
                  </Link>
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'var(--ink-brown)' }}>
                          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{item.name}</h3>
                        </Link>
                        <p style={{ fontSize: '14px', color: 'var(--stone-taupe)', marginBottom: '4px' }}>Size: {item.size}</p>
                        <p style={{ fontSize: '14px', color: 'var(--stone-taupe)' }}>{formatPrice(item.price)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: 'none', border: 'none', color: 'var(--stone-taupe)', cursor: 'pointer' }}>
                        <CloseIcon size={20} />
                      </button>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--soft-gold-line)', borderRadius: '4px' }}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span style={{ fontSize: '14px', width: '32px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-brown)' }}
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                      <div style={{ fontWeight: '600', marginLeft: 'auto' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={{ background: 'var(--pure-white)', padding: '32px', border: '1px solid var(--soft-gold-line)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(43,31,24,0.05)' }}>
              <h3 style={{ fontFamily: 'var(--font-nav)', fontSize: '20px', marginBottom: '24px' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--stone-taupe)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--stone-taupe)' }}>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <button 
                className="btn btn--primary" 
                style={{ width: '100%', padding: '16px' }}
                onClick={() => {
                  alert('Checkout flow will be implemented here.');
                }}
              >
                Proceed to Checkout
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '24px', color: 'var(--stone-taupe)', fontSize: '12px' }}>
                <DiyaIcon size={14} /> Handcrafted with care
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
