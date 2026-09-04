'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SellerProductsPage() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFallbackData = () => {
      setProductsList([
        { id: '1', name: 'Banarasi Gold Weave Saree', category: 'sarees', price_in_rupees: 28500, stock: 10, image_url: '/images/category-sarees.png' },
        { id: '2', name: 'Royal Zardozi Bridal Lehenga', category: 'lehengas', price_in_rupees: 125000, stock: 10, image_url: '/images/category-lehengas.png' },
        { id: '3', name: 'Sanganeri Block Print Kurta Set', category: 'kurta-sets', price_in_rupees: 4800, stock: 10, image_url: '/images/category-kurtas.png' },
        { id: '4', name: 'Kundan Polki Choker Set', category: 'accessories', price_in_rupees: 18500, stock: 10, image_url: '/images/category-accessories.png' },
      ]);
    };

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        
        if (data && data.length > 0) {
          setProductsList(data);
        } else {
          loadFallbackData();
        }
      } catch (err) {
        console.warn("Using products fallback data", err);
        loadFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Product Catalog Management</h1>
        <button 
          type="button"
          className="btn btn--primary" 
          onClick={() => alert('New product registration will be available in the next release.')}
        >
          + Add New Handcrafted Piece
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading products...</td></tr>
            ) : productsList.map(p => (
              <tr key={p.id}>
                <td style={{ width: '60px' }}>
                  <img src={p.image_url} alt={p.name} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td><strong>{p.name}</strong></td>
                <td><span style={{ textTransform: 'capitalize' }}>{p.category}</span></td>
                <td>₹ {Number(p.price_in_rupees || 0).toLocaleString('en-IN')}</td>
                <td>{p.stock} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
