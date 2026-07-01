import React from 'react';
import { LeafIcon } from '../../components/Icons';

export default function Shipping() {
  return (
    <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
      <h1 className="hero__title" style={{ color: 'var(--ink-brown)', marginBottom: '1rem', textAlign: 'center' }}>Shipping & Delivery</h1>
      <div className="divider" style={{ margin: '2rem auto' }}>
        <span className="divider__icon"><LeafIcon size={16} /></span>
      </div>
      
      <div style={{ color: 'var(--ink-brown-light)', lineHeight: '1.8' }}>
        <h3 style={{ color: 'var(--ink-brown)', marginTop: '2rem', marginBottom: '1rem' }}>Domestic Shipping (India)</h3>
        <p>
          We offer complimentary standard shipping on all domestic orders across India. 
          Orders are typically dispatched within 2-3 business days. Depending on your location, 
          delivery can take between 5 to 7 business days from the date of dispatch. 
          Express shipping options are available at checkout for an additional fee.
        </p>

        <h3 style={{ color: 'var(--ink-brown)', marginTop: '2rem', marginBottom: '1rem' }}>International Shipping</h3>
        <p>
          We proudly ship worldwide. International shipping rates are calculated at checkout based on 
          the destination and the weight of your order. Please note that international orders may be 
          subject to customs duties and taxes upon arrival in the destination country, which are the 
          responsibility of the customer. International delivery typically takes 10-15 business days.
        </p>

        <h3 style={{ color: 'var(--ink-brown)', marginTop: '2rem', marginBottom: '1rem' }}>Order Tracking</h3>
        <p>
          Once your order has been dispatched, you will receive a tracking link via email and SMS. 
          You can use this link to track the status of your delivery in real-time. If you have an account 
          with us, you can also view your tracking information in the 'Orders' section.
        </p>
      </div>
    </div>
  );
}
