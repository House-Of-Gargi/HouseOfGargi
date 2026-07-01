import React from 'react';
import { LeafIcon } from '../../components/Icons';

export default function Returns() {
  return (
    <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
      <h1 className="hero__title" style={{ color: 'var(--ink-brown)', marginBottom: '1rem', textAlign: 'center' }}>Returns & Exchanges</h1>
      <div className="divider" style={{ margin: '2rem auto' }}>
        <span className="divider__icon"><LeafIcon size={16} /></span>
      </div>
      
      <div style={{ color: 'var(--ink-brown-light)', lineHeight: '1.8' }}>
        <h3 style={{ color: 'var(--ink-brown)', marginTop: '2rem', marginBottom: '1rem' }}>Our Return Policy</h3>
        <p>
          We want you to be completely satisfied with your House of Gargi purchase. If for any reason you are not, 
          we accept returns within 14 days of delivery for domestic orders. Items must be unworn, unwashed, 
          with all original tags attached, and in their original packaging.
        </p>

        <h3 style={{ color: 'var(--ink-brown)', marginTop: '2rem', marginBottom: '1rem' }}>Non-Returnable Items</h3>
        <p>
          Please note that Bespoke/Custom-made items, altered items, and products purchased during clearance sales 
          are final sale and cannot be returned or exchanged. Sarees with the blouse piece detached or fall/pico 
          completed are also considered non-returnable.
        </p>

        <h3 style={{ color: 'var(--ink-brown)', marginTop: '2rem', marginBottom: '1rem' }}>How to Initiate a Return</h3>
        <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Log into your account and navigate to the 'Orders' section.</li>
          <li>Select the order containing the item(s) you wish to return and click 'Request Return'.</li>
          <li>Follow the instructions to select a reason for return and schedule a pickup.</li>
          <li>Pack the items securely in their original packaging. Our courier partner will collect the package.</li>
        </ol>

        <h3 style={{ color: 'var(--ink-brown)', marginTop: '2rem', marginBottom: '1rem' }}>Refunds</h3>
        <p>
          Once your return is received and inspected by our quality team, we will process your refund. 
          Refunds will be issued to the original method of payment within 7-10 business days. 
          Shipping charges are non-refundable.
        </p>
      </div>
    </div>
  );
}
