'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import CustomDropdown from '@/components/CustomDropdown';
import { products, categories } from '@/data/products';
import { DiyaIcon } from '@/components/Icons';

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
      <div className="category-banner" style={{ height: '360px' }}>
        <img src="/images/banner-sarees-wide.png" alt="House of Gargi Complete Catalog" />
        <div className="category-banner__content">
          <h1>The Complete Collection</h1>
          <p>Handwoven masterpieces, bridal silhouettes, and bespoke adornments.</p>
        </div>
      </div>

      <section className="section section--ivory" style={{ minHeight: '80vh' }}>
        <div className="container">
          {/* Category Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button
              type="button"
              className={`btn ${selectedCategory === 'all' ? 'btn--primary' : 'btn--outline'}`}
              onClick={() => setSelectedCategory('all')}
              style={{ padding: '8px 20px', fontSize: '12px' }}
            >
              All Items ({products.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`btn ${selectedCategory === cat.id ? 'btn--primary' : 'btn--outline'}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ padding: '8px 20px', fontSize: '12px' }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Filter & Sort Bar */}
          <div className="filter-bar" style={{ marginBottom: '36px' }}>
            <div className="filter-bar__group">
              <span className="filter-bar__label">Fabric:</span>
              <CustomDropdown
                options={fabrics.map(f => ({ value: f, label: f }))}
                value={selectedFabric}
                onChange={setSelectedFabric}
                placeholder="All Fabrics"
              />
            </div>

            <div className="filter-bar__group">
              <span className="filter-bar__label">Sort By:</span>
              <CustomDropdown
                options={[
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                ]}
                value={sort}
                onChange={setSort}
                placeholder="Featured"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <DiyaIcon size={40} style={{ color: 'var(--gargi-gold)', marginBottom: '16px' }} />
              <h3>No items match your selected filters.</h3>
              <button 
                type="button" 
                className="btn btn--primary" 
                style={{ marginTop: '20px' }}
                onClick={() => { setSelectedCategory('all'); setSelectedFabric(''); setSort(''); }}
              >
                Reset Filters
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
