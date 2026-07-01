import { useState } from 'react';

export default function Products() {
  const [products] = useState([
    { id: '1', name: 'Banarasi Silk Saree', category: 'Sarees', price: '₹ 45,000', stock: 4 },
    { id: '2', name: 'Zari Work Lehenga', category: 'Lehengas', price: '₹ 85,000', stock: 2 },
    { id: '3', name: 'Cotton Block Print Kurta', category: 'Kurta Sets', price: '₹ 12,000', stock: 15 },
  ]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Products</h1>
        <button className="btn btn--primary">Add Product</button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td>{p.category}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button style={{ background: 'none', border: 'none', color: 'var(--maharani-maroon)', cursor: 'pointer', marginRight: '16px' }}>Edit</button>
                  <button style={{ background: 'none', border: 'none', color: 'var(--stone-taupe)', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
