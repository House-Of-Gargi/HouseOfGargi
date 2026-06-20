import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ProductCard from '../components/ProductCard';
import { getCategory, getProductsByCategory, categories } from '../data/products';
import { DiyaIcon, ArrowRightIcon } from '../components/Icons';

export default function Category() {
  const { id } = useParams();
  const [fabric, setFabric] = useState('');
  const [occasion, setOccasion] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setFabric('');
    setOccasion('');
    setSort('');
  }, [id]);

  const category = getCategory(id);
  if (!category) return <div className="section container"><h2>Category not found.</h2></div>;

  let items = getProductsByCategory(id);

  /* Filters */
  if (fabric) items = items.filter(p => p.fabric.toLowerCase().includes(fabric.toLowerCase()));
  if (occasion) items = items.filter(p => p.occasion === occasion);
  if (sort === 'low') items = [...items].sort((a, b) => a.price - b.price);
  if (sort === 'high') items = [...items].sort((a, b) => b.price - a.price);

  const fabrics = [...new Set(getProductsByCategory(id).map(p => p.fabric))];
  const occasions = [...new Set(getProductsByCategory(id).map(p => p.occasion))];
  const otherCategories = categories.filter(c => c.id !== id);

  return (
    <>
      {/* Banner */}
      <div className="category-banner">
        <img src={category.bannerImage || category.image} alt={category.name} />
        <div className="category-banner__content">
          <h1>{category.name}</h1>
          <p>{category.tagline}</p>
        </div>
      </div>

      <div className="section section--ivory" style={{ paddingTop: '0' }}>
        <div className="container">
          {/* Filter Bar */}
          <div className="filter-bar">
            <span className="filter-bar__label">Filter & Sort</span>
            <select value={fabric} onChange={e => setFabric(e.target.value)}>
              <option value="">All Fabrics</option>
              {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={occasion} onChange={e => setOccasion(e.target.value)}>
              <option value="">All Occasions</option>
              {occasions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="">Sort by</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>

          {/* Grid */}
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--stone-taupe)' }}>
              <p>No products match your filters. <button style={{ color: 'var(--maharani-maroon)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { setFabric(''); setOccasion(''); }}>Clear filters</button></p>
            </div>
          ) : (
            <div className="product-grid">
              {items.map(product => (
                <ScrollReveal key={product.id}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Explore Other Collections */}
          <div className="divider" style={{ marginTop: '64px' }}><span className="divider__icon"><DiyaIcon size={16} /></span></div>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2>Explore Other Collections</h2>
            </div>
            <div className="related-grid">
              {otherCategories.map(cat => (
                <Link to={`/category/${cat.id}`} className="category-tile" key={cat.id} style={{ aspectRatio: '16/9' }}>
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-tile__border" />
                  <div className="category-tile__label">
                    <h3>{cat.name}</h3>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Explore <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
