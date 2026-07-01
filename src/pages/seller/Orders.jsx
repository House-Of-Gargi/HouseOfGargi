import { useState } from 'react';

export default function Orders() {
  const [orders] = useState([
    { id: '#HG-1042', customer: 'Priya Sharma', date: 'Oct 12, 2026', total: '₹ 45,000', status: 'Processing' },
    { id: '#HG-1041', customer: 'Anjali Desai', date: 'Oct 10, 2026', total: '₹ 22,500', status: 'Shipped' },
    { id: '#HG-B009', customer: 'Simran Kaur', date: 'Oct 08, 2026', total: '₹ 85,000', status: 'Bespoke Review' },
    { id: '#HG-1040', customer: 'Neha Gupta', date: 'Oct 05, 2026', total: '₹ 18,000', status: 'Delivered' },
  ]);

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
            {orders.map(o => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{o.customer}</td>
                <td>{o.date}</td>
                <td>{o.total}</td>
                <td><span className={`status-badge ${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
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
