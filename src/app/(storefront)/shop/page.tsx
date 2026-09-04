'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import CustomDropdown from '@/components/CustomDropdown';
import { products, categories } from '@/data/products';
import { DiyaIcon, FilterIcon, CloseIcon } from '@/components/Icons';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [sort, setSort] = useState<string>('');

  let filtered = [...products];
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }
  if (selectedFabric) {
    filtered = filtered.filter(p => p.fabric.toLowerCase().includes(selectedFabric.toLowerCase()));
  }

  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  const fabrics = Array.from(new Set(products.map(p => p.fabric)));

  return (
    <>
      <div className="category-banner" style={{ height: '380px' }}>
        <img src="/images/banner-sarees-wide.png" alt="House of Gargi Complete Catalog" />
        <div className="category-banner__content">
          <h1>The Complete Collection</h1>
          <p>Handwoven masterpieces, bridal silhouettes, and bespoke adornments.</p>
        </div>
      </div>

      <section className="section section--ivory section--category" style={{ minHeight: '80vh' }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div className="breadcrumb" style={{ marginBottom: '22px' }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink-brown)', fontWeight: 600 }}>The Atelier Catalog</span>
          </div>

          {/* Category Filter Tabs Rail */}
          <div className="category-tabs-rail">
            <button
              type="button"
              className={`category-tab-btn ${selectedCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Pieces ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`category-tab-btn ${selectedCategory === cat.id ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Atelier Filter & Sort Bar */}
          <div className="filter-bar">
            <div className="filter-bar__header">
              <div className="filter-bar__title">
                <FilterIcon size={18} style={{ color: 'var(--gargi-gold)' }} />
                <span>Refine Collection</span>
              </div>
              <div className="filter-bar__summary">
                Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'Piece' : 'Pieces'}
              </div>
            </div>

            <div className="filter-bar__controls">
              <div className="filter-bar__group">
                <span className="filter-bar__label">Fabric</span>
                <CustomDropdown
                  options={fabrics.map(f => ({ value: f, label: f }))}
                  value={selectedFabric}
                  onChange={setSelectedFabric}
                  placeholder="All Fabrics"
                  showEmptyOption
                  fullWidth
                />
              </div>

              <div className="filter-bar__group">
                <span className="filter-bar__label">Sort By</span>
                <CustomDropdown
                  options={[
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                  ]}
                  value={sort}
                  onChange={setSort}
                  placeholder="Featured Curation"
                  showEmptyOption
                  fullWidth
                />
              </div>
            </div>

            {/* Active Filter Chips */}
            {(selectedFabric || sort || selectedCategory !== 'all') && (
              <div className="filter-bar__active-chips">
                <span className="filter-bar__active-label">Active:</span>
                {selectedCategory !== 'all' && (
                  <button type="button" className="filter-chip" onClick={() => setSelectedCategory('all')}>
                    Category: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory} <CloseIcon size={12} />
                  </button>
                )}
                {selectedFabric && (
                  <button type="button" className="filter-chip" onClick={() => setSelectedFabric('')}>
                    Fabric: {selectedFabric} <CloseIcon size={12} />
                  </button>
                )}
                {sort && (
                  <button type="button" className="filter-chip" onClick={() => setSort('')}>
                    Sort: {sort === 'price-asc' ? 'Low to High' : 'High to Low'} <CloseIcon size={12} />
                  </button>
                )}
                <button 
                  type="button" 
                  className="filter-bar__clear-btn" 
                  onClick={() => { setSelectedCategory('all'); setSelectedFabric(''); setSort(''); }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 24px', 
              background: 'var(--pure-white)', 
              borderRadius: '8px', 
              border: '1px solid var(--soft-gold-line)',
              boxShadow: '0 4px 16px rgba(43, 31, 24, 0.03)'
            }}>
              <DiyaIcon size={44} style={{ color: 'var(--gargi-gold)', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink-brown)', marginBottom: '8px' }}>
                No items match your selected filters.
              </h3>
              <p style={{ color: 'var(--stone-taupe)', fontSize: '15px', maxWidth: '420px', margin: '0 auto 20px' }}>
                Try selecting &ldquo;All Pieces&rdquo; or clearing your fabric filter to see more handcrafted treasures.
              </p>
              <button 
                type="button" 
                className="btn btn--primary" 
                onClick={() => { setSelectedCategory('all'); setSelectedFabric(''); setSort(''); }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(product => (
                <ScrollReveal key={product.id}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
