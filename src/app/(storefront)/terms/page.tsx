export default function TermsPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px', minHeight: '60vh' }}>
      <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--gargi-gold)', marginBottom: '32px' }}>Terms and Conditions</h1>
      
      <div style={{ color: 'var(--ink-brown)', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>1. Introduction</h2>
        <p style={{ marginBottom: '16px' }}>
          Welcome to House of Gargi. By accessing or using our boutique services, you agree to comply with and be bound by these Terms and Conditions.
        </p>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>2. Intellectual Property</h2>
        <p style={{ marginBottom: '16px' }}>
          All content, including textile designs, handloom patterns, copy, photography, graphics, and logos are the protected property of House of Gargi.
        </p>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>3. Product Authenticity and Bespoke Orders</h2>
        <p style={{ marginBottom: '16px' }}>
          Because our pieces are handcrafted by individual artisans, subtle variations in weaving texture and natural dyes are marks of authenticity. Bespoke orders are made-to-measure and non-refundable once production commences.
        </p>

        <h2 style={{ fontSize: '20px', marginBottom: '16px', marginTop: '32px' }}>4. Returns and Refunds</h2>
        <p style={{ marginBottom: '16px' }}>
          Due to the custom and delicate nature of our garments, returns on standard pieces are accepted within 14 days of delivery in pristine condition.
        </p>
      </div>
    </div>
  );
}
