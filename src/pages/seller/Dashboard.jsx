import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({ revenue: 245000, orders: 14, products: 32 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock graph data
  const chartData = [
    { name: 'Mon', revenue: 15000 },
    { name: 'Tue', revenue: 25000 },
    { name: 'Wed', revenue: 42000 },
    { name: 'Thu', revenue: 38000 },
    { name: 'Fri', revenue: 65000 },
    { name: 'Sat', revenue: 85000 },
    { name: 'Sun', revenue: 45000 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('products').select('*', { count: 'exact' })
        ]);

        if (ordersRes.data && ordersRes.data.length > 0) {
          const totalRev = ordersRes.data.reduce((acc, order) => acc + order.total_rupees, 0);
          setStats({
            revenue: totalRev,
            orders: ordersRes.data.length,
            products: productsRes.data ? productsRes.data.length : 0
          });
          setRecentOrders(ordersRes.data.slice(0, 5));
        } else {
          useFallbackData();
        }
      } catch (err) {
        console.error("Failed to fetch from Supabase, using fallback data", err);
        useFallbackData();
      } finally {
        setLoading(false);
      }
    };

    const useFallbackData = () => {
      setRecentOrders([
        { id: '1', order_number: '#HG-1042', customer_name: 'Priya Sharma', total_rupees: 45000, status: 'Processing' },
        { id: '2', order_number: '#HG-1041', customer_name: 'Anjali Desai', total_rupees: 22500, status: 'Shipped' },
        { id: '3', order_number: '#HG-B009', customer_name: 'Simran Kaur', total_rupees: 85000, status: 'Bespoke Review' },
      ]);
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '32px' }}>Dashboard Overview</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p className="dashboard-card__value">₹ {stats.revenue.toLocaleString()}</p>
          <span className="dashboard-card__trend positive">+12% this month</span>
        </div>
        <div className="dashboard-card">
          <h3>Active Orders</h3>
          <p className="dashboard-card__value">{stats.orders}</p>
          <span className="dashboard-card__trend">4 pending bespoke</span>
        </div>
        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p className="dashboard-card__value">{stats.products}</p>
          <span className="dashboard-card__trend positive">2 added this week</span>
        </div>
      </div>

      {/* Revenue Graph */}
      <div style={{ marginTop: '48px', background: 'var(--pure-white)', padding: '24px', borderRadius: '8px', border: '1px solid var(--soft-gold-line)', boxShadow: '0 4px 12px rgba(43,31,24,0.03)' }}>
        <h3 style={{ marginBottom: '24px', fontSize: '16px', color: 'var(--ink-brown)' }}>Weekly Revenue</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--gargi-gold)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--gargi-gold)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--stone-taupe)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--stone-taupe)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(228, 211, 174, 0.3)" />
              <Tooltip 
                contentStyle={{ background: 'var(--ink-brown)', border: 'none', borderRadius: '8px', color: 'var(--pure-white)' }}
                itemStyle={{ color: 'var(--gargi-gold)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--gargi-gold)" fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: '48px' }}>
        <h2 style={{ marginBottom: '24px' }}>Recent Activity</h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td><span className={`status-badge ${(order.status || '').toLowerCase().replace(' ', '-')}`}>{order.status}</span></td>
                  <td>₹ {order.total_rupees?.toLocaleString() || '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
