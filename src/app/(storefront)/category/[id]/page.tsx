'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import CustomDropdown from '@/components/CustomDropdown';
import { getCategory, getProductsByCategory, categories } from '@/data/products';
import { DiyaIcon, ArrowRightIcon } from '@/components/Icons';

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [fabric, setFabric] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');
  const [sort, setSort] = useState<string>('');

  const category = getCategory(id);
  if (!category) {
    notFound();
  }

  let items = getProductsByCategory(id);

  if (fabric) {
    items = items.filter(p => p.fabric.toLowerCase().includes(fabric.toLowerCase()));
  }
  if (occasion) {
    items = items.filter(p => p.occasion === occasion);
  }

  if (sort === 'price-asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    items.sort((a, b) => b.price - a.price);
  }

  const allCategoryItems = getProductsByCategory(id);
  const fabrics = Array.from(new Set(allCategoryItems.map(p => p.fabric)));
  const occasions = Array.from(new Set(allCategoryItems.map(p => p.occasion)));
  const otherCategories = categories.filter(c => c.id !== id);

  return (
    <>
      <div className="category-banner">
        <img src={category.bannerImage} alt={category.name} />
        <div className="category-banner__content">
          <h1>{category.name}</h1>
          <p>{category.tagline}</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container">
          {/* Filters */}
          <div className="filter-bar">
            <div className="filter-bar__group">
              <span className="filter-bar__label">Fabric:</span>
              <CustomDropdown
                options={fabrics.map(f => ({ value: f, label: f }))}
                value={fabric}
                onChange={setFabric}
                placeholder="All Fabrics"
              />
            </div>

            <div className="filter-bar__group">
              <span className="filter-bar__label">Occasion:</span>
              <CustomDropdown
                options={occasions.map(o => ({ value: o, label: o }))}
                value={occasion}
                onChange={setOccasion}
                placeholder="All Occasions"
              />
            </div>

            <div className="filter-bar__group">
              <span className="filter-bar__label">Sort:</span>
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

          {/* Product Grid */}
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <DiyaIcon size={40} style={{ color: 'var(--gargi-gold)', marginBottom: '16px' }} />
              <h3>No pieces match your selected filters.</h3>
              <button 
                type="button" 
                className="btn btn--primary" 
                style={{ marginTop: '20px' }}
                onClick={() => { setFabric(''); setOccasion(''); setSort(''); }}
              >
                Clear Filters
              </button>
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

          {/* Explore Other Categories */}
          <div style={{ marginTop: '80px' }}>
            <div className="divider"><span className="divider__icon"><DiyaIcon size={16} /></span></div>
            <h3 style={{ textAlign: 'center', margin: '32px 0 24px', color: 'var(--ink-brown)' }}>Explore More Collections</h3>
            <div className="category-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {otherCategories.map(cat => (
                <Link href={`/category/${cat.id}`} key={cat.id} className="category-tile" style={{ height: '260px' }}>
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
          </div>
        </div>
      </section>
    </>
  );
}
