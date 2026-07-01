import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          useFallbackData();
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        useFallbackData();
      } finally {
        setLoading(false);
      }
    };

    const useFallbackData = () => {
      setProducts([
        { id: '1', name: 'Banarasi Gold Weave Saree', category: 'sarees', price_in_rupees: 28500, stock: 10, image_url: '/images/category-sarees.png' },
        { id: '2', name: 'Royal Zardozi Bridal Lehenga', category: 'lehengas', price_in_rupees: 125000, stock: 10, image_url: '/images/category-lehengas.png' },
        { id: '3', name: 'Sanganeri Block Print Kurta Set', category: 'kurta-sets', price_in_rupees: 4800, stock: 10, image_url: '/images/category-kurtas.png' },
        { id: '4', name: 'Kundan Polki Choker Set', category: 'accessories', price_in_rupees: 18500, stock: 10, image_url: '/images/category-accessories.png' },
      ]);
    };

    fetchProducts();
  }, []);

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
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading products...</td></tr>
            ) : products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                    <strong>{p.name}</strong>
                  </div>
                </td>
                <td>{p.category}</td>
                <td>₹ {p.price_in_rupees?.toLocaleString()}</td>
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
