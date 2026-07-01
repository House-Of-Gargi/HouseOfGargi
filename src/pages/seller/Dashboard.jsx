export default function Dashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: '32px' }}>Dashboard Overview</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p className="dashboard-card__value">₹ 2,45,000</p>
          <span className="dashboard-card__trend positive">+12% this month</span>
        </div>
        <div className="dashboard-card">
          <h3>Active Orders</h3>
          <p className="dashboard-card__value">14</p>
          <span className="dashboard-card__trend">4 pending bespoke</span>
        </div>
        <div className="dashboard-card">
          <h3>Total Products</h3>
          <p className="dashboard-card__value">32</p>
          <span className="dashboard-card__trend positive">2 added this week</span>
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
              <tr>
                <td>#HG-1042</td>
                <td>Priya Sharma</td>
                <td><span className="status-badge processing">Processing</span></td>
                <td>₹ 45,000</td>
              </tr>
              <tr>
                <td>#HG-1041</td>
                <td>Anjali Desai</td>
                <td><span className="status-badge completed">Shipped</span></td>
                <td>₹ 22,500</td>
              </tr>
              <tr>
                <td>#HG-B009</td>
                <td>Simran Kaur</td>
                <td><span className="status-badge bespoke">Bespoke Review</span></td>
                <td>₹ 85,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
