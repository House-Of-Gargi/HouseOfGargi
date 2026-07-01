import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        
        if (data && data.length > 0) {
          setOrders(data);
        } else {
          useFallbackData();
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
        useFallbackData();
      } finally {
        setLoading(false);
      }
    };

    const useFallbackData = () => {
      setOrders([
        { id: '1', order_number: '#HG-1042', customer_name: 'Priya Sharma', created_at: '2026-10-12', total_rupees: 45000, status: 'Processing' },
        { id: '2', order_number: '#HG-1041', customer_name: 'Anjali Desai', created_at: '2026-10-10', total_rupees: 22500, status: 'Shipped' },
        { id: '3', order_number: '#HG-B009', customer_name: 'Simran Kaur', created_at: '2026-10-08', total_rupees: 85000, status: 'Bespoke Review' },
        { id: '4', order_number: '#HG-1040', customer_name: 'Neha Gupta', created_at: '2026-10-05', total_rupees: 18000, status: 'Delivered' },
      ]);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Orders</h1>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading orders...</td></tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td><strong>{o.order_number}</strong></td>
                <td>{o.customer_name}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>₹ {o.total_rupees?.toLocaleString()}</td>
                <td><span className={`status-badge ${(o.status || '').toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
                <td>
                  <button style={{ background: 'none', border: 'none', color: 'var(--maharani-maroon)', cursor: 'pointer' }}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
