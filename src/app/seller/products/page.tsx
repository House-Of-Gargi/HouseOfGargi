'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Shirt, 
  Plus, 
  Search, 
  Loader2, 
  Check, 
  X, 
  PackageCheck 
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';

const CATEGORY_OPTIONS = [
  { value: 'sarees', label: 'Banarasi Sarees' },
  { value: 'lehengas', label: 'Bridal Lehengas' },
  { value: 'kurta-sets', label: 'Kurta Sets' },
  { value: 'accessories', label: 'Heritage Jewellery' },
];

const DEFAULT_IMAGE_BY_CATEGORY: Record<string, string> = {
  sarees: '/images/category-sarees.png',
  lehengas: '/images/category-lehengas.png',
  'kurta-sets': '/images/category-kurtas.png',
  accessories: '/images/category-accessories.png',
};

const ASSET_OPTIONS = [
  // Sarees
  { value: '/images/category-sarees.png', label: 'Saree: Banarasi Gold Weave' },
  { value: '/images/products/saree-kanchipuram.jpg', label: 'Saree: Kanchipuram Temple Border' },
  { value: '/images/products/saree-chanderi.jpg', label: 'Saree: Chanderi Floral Jaal' },
  { value: '/images/products/saree-tussar.jpg', label: 'Saree: Tussar Silk Block Print' },
  { value: '/images/products/saree-paithani.jpg', label: 'Saree: Paithani Peacock Pallu' },
  { value: '/images/collections/collection-sarees.jpg', label: 'Saree: Master Loom Archive' },
  { value: '/images/collections/explore-sarees.jpg', label: 'Saree: Udaipur Palace Jharokha' },
  // Lehengas
  { value: '/images/category-lehengas.png', label: 'Lehenga: Royal Zardozi Bridal' },
  { value: '/images/products/lehenga-gota-patti.jpg', label: 'Lehenga: Gota Patti Festive' },
  { value: '/images/products/lehenga-chikankari.jpg', label: 'Lehenga: Chikankari Ivory Anarkali' },
  { value: '/images/products/lehenga-mirror-work.jpg', label: 'Lehenga: Mirror Work Chaniya Choli' },
  { value: '/images/collections/collection-lehengas.jpg', label: 'Lehenga: Rajputana Bridal Suite' },
  { value: '/images/collections/explore-lehengas.jpg', label: 'Lehenga: Jaipur Courtyard Atelier' },
  // Kurta Sets
  { value: '/images/category-kurtas.png', label: 'Kurta: Sanganeri Block Print' },
  { value: '/images/products/kurta-chikankari-white.jpg', label: 'Kurta: Chikankari White-on-White' },
  { value: '/images/products/kurta-ajrakh-silk.jpg', label: 'Kurta: Ajrakh Silk Set' },
  { value: '/images/products/kurta-kalamkari.jpg', label: 'Kurta: Kalamkari Anarkali' },
  { value: '/images/products/kurta-bandhani-silk.jpg', label: 'Kurta: Bandhani Silk Festival' },
  { value: '/images/collections/collection-kurtas.jpg', label: 'Kurta: Silk Summer Atelier' },
  { value: '/images/collections/explore-kurtas.jpg', label: 'Kurta: Limestone Colonnade Pavilion' },
  // Accessories & Jewellery
  { value: '/images/category-accessories.png', label: 'Jewellery: Kundan Polki Choker Set' },
  { value: '/images/products/accessory-meenakari-jhumka.jpg', label: 'Jewellery: Meenakari Jhumka Earrings' },
  { value: '/images/products/accessory-temple-jewellery.jpg', label: 'Jewellery: Temple Jewellery Necklace' },
  { value: '/images/products/accessory-phulkari-dupatta.jpg', label: 'Accessory: Phulkari Silk Dupatta' },
  { value: '/images/collections/collection-accessories.jpg', label: 'Jewellery: Forest Marble Suite' },
  { value: '/images/collections/explore-accessories.jpg', label: 'Jewellery: Mughal Casket Vault' },
];

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'sarees',
    price_in_rupees: '',
    stock: '',
    image_url: '/images/category-sarees.png',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newProduct.name || !newProduct.price_in_rupees || !newProduct.stock) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.from('products').insert([
        {
          name: newProduct.name,
          category: newProduct.category,
          price_in_rupees: parseInt(newProduct.price_in_rupees, 10),
          stock: parseInt(newProduct.stock, 10),
          image_url: newProduct.image_url || '/images/category-sarees.png',
        }
      ]).select();

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts([data[0], ...products]);
        setIsAddModalOpen(false);
        setNewProduct({
          name: '',
          category: 'sarees',
          price_in_rupees: '',
          stock: '',
          image_url: '/images/category-sarees.png',
        });
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to register new product in database.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch = searchQuery === '' || 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Top Header Card */}
      <div className="atelier-header-card">
        <div className="atelier-title-group">
          <div className="atelier-title-icon">
            <Shirt style={{ width: 22, height: 22 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h1 className="atelier-page-title">
                Artisan Catalog &amp; Loom Inventory
              </h1>
              <span className="atelier-live-pill">
                <span className="atelier-live-dot" />
                {products.length} MASTER PIECES
              </span>
            </div>
            <p style={{ fontSize: '0.98rem', color: 'var(--stone-taupe)', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
              Real-time catalog pieces stored in Supabase &bull; Zero placeholder data
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            background: 'var(--maharani-maroon)',
            color: 'var(--ivory-silk)',
            border: '1.5px solid var(--maharani-maroon)',
            borderRadius: '2px',
            padding: '0.75rem 1.4rem',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-nav)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(122, 35, 49, 0.15)',
          }}
        >
          <Plus style={{ width: 15, height: 15 }} />
          Add Handcrafted Piece
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="table-top-bar" style={{ background: 'var(--pure-white)', padding: '1rem 1.5rem', border: '1px solid var(--soft-gold-line)', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Catalog' },
            { id: 'sarees', label: 'Banarasi Sarees' },
            { id: 'lehengas', label: 'Bridal Lehengas' },
            { id: 'kurta-sets', label: 'Kurta Sets' },
            { id: 'accessories', label: 'Heritage Jewellery' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              style={{
                background: selectedCategory === tab.id ? 'var(--maharani-maroon)' : 'var(--ivory-silk)',
                color: selectedCategory === tab.id ? 'var(--ivory-silk)' : 'var(--stone-taupe)',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '2px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-nav)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--pure-white)',
          border: '1px solid var(--soft-gold-line)',
          borderRadius: '2px',
          padding: '0.45rem 0.85rem',
        }}>
          <Search style={{ width: 15, height: 15, color: 'var(--stone-taupe)', marginRight: '0.45rem' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piece title..."
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-sans)',
              color: 'var(--ink-brown)',
              width: '180px',
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Products Data Table */}
      <div className="luxury-table-card">
        <div className="table-top-bar" style={{ paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink-brown)', margin: 0 }}>
              Atelier Master Catalog
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--stone-taupe)', margin: '0.2rem 0 0 0' }}>
              Connected live to Supabase table &apos;products&apos;
            </p>
          </div>
          <span style={{ fontSize: '0.88rem', color: 'var(--stone-taupe)', fontFamily: 'var(--font-nav)', fontWeight: 600 }}>
            Showing {filteredProducts.length} items
          </span>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
          <table className="luxury-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Preview</th>
                <th>Artisan Piece Title</th>
                <th>Collection</th>
                <th>Price (INR)</th>
                <th>Godown Stock</th>
                <th style={{ textAlign: 'center' }}>Loom State</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
                    <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite', display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Loading catalog pieces from Supabase...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--stone-taupe)' }}>
                    No products found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.image_url || '/images/category-sarees.png'}
                        alt={p.name}
                        style={{ width: 44, height: 52, objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--soft-gold-line)' }}
                      />
                    </td>
                    <td>
                      <strong style={{ color: 'var(--ink-brown)', display: 'block', fontSize: '1rem' }}>
                        {p.name}
                      </strong>
                      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-nav)', color: 'var(--stone-taupe)', fontWeight: 500 }}>
                        SKU: {p.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '2px',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-nav)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: 'var(--ivory-silk)',
                        border: '1px solid var(--soft-gold-line)',
                        color: 'var(--stone-taupe)',
                      }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--ink-brown)', fontSize: '1rem' }}>
                      ₹ {Number(p.price_in_rupees || 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: Number(p.stock) > 5 ? '#166534' : 'var(--maharani-maroon)' }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '2px',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-nav)',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: '#F0FDF4',
                        color: '#166534',
                        border: '1px solid #BBF7D0',
                      }}>
                        In Atelier
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(43, 31, 24, 0.5)',
          backdropFilter: 'blur(3px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--pure-white)',
            borderRadius: '4px',
            padding: '2.25rem 2rem',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 40px rgba(43, 31, 24, 0.15)',
            border: '1px solid var(--soft-gold-line)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, margin: 0, color: 'var(--ink-brown)' }}>
                Register Handcrafted Piece
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--stone-taupe)' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {formError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECDD3', color: 'var(--maharani-maroon)', padding: '0.75rem', borderRadius: '2px', fontSize: '0.88rem', marginBottom: '1rem', textAlign: 'center' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-nav)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--stone-taupe)', marginBottom: '0.4rem' }}>
                  Artisan Piece Title
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Katan Silk Brocade Saree"
                  style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '2px', border: '1px solid var(--soft-gold-line)', outline: 'none', fontSize: '0.95rem', color: 'var(--ink-brown)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-nav)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--stone-taupe)', marginBottom: '0.4rem' }}>
                    Collection
                  </label>
                  <CustomDropdown
                    fullWidth
                    options={CATEGORY_OPTIONS}
                    value={newProduct.category}
                    onChange={(val) => setNewProduct({ 
                      ...newProduct, 
                      category: val,
                      image_url: DEFAULT_IMAGE_BY_CATEGORY[val] || newProduct.image_url
                    })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-nav)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--stone-taupe)', marginBottom: '0.4rem' }}>
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price_in_rupees}
                    onChange={(e) => setNewProduct({ ...newProduct, price_in_rupees: e.target.value })}
                    placeholder="32000"
                    style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '2px', border: '1px solid var(--soft-gold-line)', outline: 'none', fontSize: '0.95rem', color: 'var(--ink-brown)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-nav)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--stone-taupe)', marginBottom: '0.4rem' }}>
                    Initial Loom Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="10"
                    style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '2px', border: '1px solid var(--soft-gold-line)', outline: 'none', fontSize: '0.95rem', color: 'var(--ink-brown)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontFamily: 'var(--font-nav)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--stone-taupe)', marginBottom: '0.4rem' }}>
                    Curated Asset
                  </label>
                  <CustomDropdown
                    fullWidth
                    options={ASSET_OPTIONS}
                    value={newProduct.image_url}
                    onChange={(val) => setNewProduct({ ...newProduct, image_url: val })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1rem', borderTop: '1px solid var(--soft-gold-line)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '0.75rem 1.4rem', borderRadius: '2px', border: '1px solid var(--soft-gold-line)', background: 'transparent', color: 'var(--stone-taupe)', fontFamily: 'var(--font-nav)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.75rem 1.6rem', borderRadius: '2px', border: '1.5px solid var(--maharani-maroon)', background: 'var(--maharani-maroon)', color: 'var(--ivory-silk)', fontFamily: 'var(--font-nav)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.14em', cursor: submitting ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {submitting ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> : <Check style={{ width: 15, height: 15 }} />}
                  Save to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
