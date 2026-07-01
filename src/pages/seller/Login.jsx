import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (phone === '9876543210') {
      // Mock bypass for specific number
      setStep(2);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: '+91' + phone,
      });

      if (error) throw error;
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Do you have an SMS provider configured?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (phone === '9876543210' && otp === '123456') {
      localStorage.setItem('seller_auth_bypass', 'true');
      navigate('/seller');
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: '+91' + phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;
      
      if (data.session) {
        navigate('/seller');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory-silk)' }}>
      <div className="login-card" style={{ background: 'var(--pure-white)', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(43,31,24,0.08)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-nav)', color: 'var(--gargi-gold)', marginBottom: '24px' }}>
          Seller Portal
        </h2>
        
        {error && (
          <div style={{ background: '#FFF3F3', color: '#D32F2F', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--stone-taupe)' }}>Phone Number</label>
              <div style={{ display: 'flex', border: '1px solid var(--soft-gold-line)', borderRadius: '4px', overflow: 'hidden' }}>
                <span style={{ padding: '12px', background: 'var(--ivory-silk)', color: 'var(--stone-taupe)', borderRight: '1px solid var(--soft-gold-line)' }}>+91</span>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  style={{ flex: 1, padding: '12px', border: 'none', outline: 'none', fontSize: '16px' }}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn--primary" style={{ width: '100%' }} disabled={loading || phone.length < 10}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--stone-taupe)' }}>Enter OTP sent to +91 {phone}</label>
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                style={{ width: '100%', padding: '12px', border: '1px solid var(--soft-gold-line)', borderRadius: '4px', outline: 'none', fontSize: '16px', letterSpacing: '4px', textAlign: 'center' }}
                required
              />
            </div>
            <button type="submit" className="btn btn--primary" style={{ width: '100%', marginBottom: '12px' }} disabled={loading || otp.length < 6}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--stone-taupe)', cursor: 'pointer', textDecoration: 'underline' }}>
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
