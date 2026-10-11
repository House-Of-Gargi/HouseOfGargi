'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CustomDropdown from '@/components/CustomDropdown';
import { products, categories } from '@/data/products';
import { 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [sort, setSort] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derived options
  const allFabrics = useMemo(() => {
    return Array.from(new Set(products.map(p => p.fabric))).filter(Boolean);
  }, []);

  const fabricOptions = useMemo(() => {
    return allFabrics.map(f => ({ value: f, label: f }));
  }, [allFabrics]);

  const categoryOptions = useMemo(() => [
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ], []);

  const priceOptions = useMemo(() => [
    { value: 'under-15k', label: 'Under ₹15,000' },
    { value: '15k-40k', label: '₹15,000 – ₹40,000' },
    { value: 'above-40k', label: 'Above ₹40,000' },
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A–Z' },
  ], []);

  const filteredItems = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedFabric) {
      result = result.filter(p => p.fabric.toLowerCase().includes(selectedFabric.toLowerCase()));
    }

    if (selectedPriceTier === 'under-15k') {
      result = result.filter(p => p.price < 15000);
    } else if (selectedPriceTier === '15k-40k') {
      result = result.filter(p => p.price >= 15000 && p.price <= 40000);
    } else if (selectedPriceTier === 'above-40k') {
      result = result.filter(p => p.price > 40000);
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, selectedFabric, selectedPriceTier, sort]);

  const hasActiveFilters = Boolean(
    (selectedCategory && selectedCategory !== 'all') ||
    selectedFabric ||
    (selectedPriceTier && selectedPriceTier !== 'all') ||
    sort
  );

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFabric('');
    setSelectedPriceTier('all');
    setSort('');
  };

  return (
    <div className="explore-page">
      <div className="container">
        {/* ── 1. Results for : All Creations ───────────────────────── */}
        <div className="explore-header-row">
          <div className="explore-results-title-wrap">
            <span className="explore-results-label">Results for :</span>
            <h1 className="explore-results-query" style={{ display: 'inline' }}>
              All Creations
            </h1>
            <span className="explore-results-count">
              ({filteredItems.length} {filteredItems.length === 1 ? 'Piece' : 'Pieces'})
            </span>
          </div>
        </div>

        {/* ── 2. Filter Strip with CustomDropdown ─────────────────── */}
        <div className="explore-filter-strip">
          <div className="explore-filter-strip__left">
            <div className="explore-strip-group">
              <span className="explore-strip-label">Category</span>
              <CustomDropdown
                options={categoryOptions}
                value={selectedCategory === 'all' ? '' : selectedCategory}
                onChange={(v) => setSelectedCategory(v || 'all')}
                placeholder="All Categories"
                showEmptyOption
                fullWidth
              />
            </div>

            <div className="explore-strip-group">
              <span className="explore-strip-label">Fabric</span>
              <CustomDropdown
                options={fabricOptions}
                value={selectedFabric}
                onChange={setSelectedFabric}
                placeholder="All Fabrics"
                showEmptyOption
                fullWidth
              />
            </div>

            <div className="explore-strip-group">
              <span className="explore-strip-label">Price</span>
              <CustomDropdown
                options={priceOptions}
                value={selectedPriceTier === 'all' ? '' : selectedPriceTier}
                onChange={(v) => setSelectedPriceTier(v || 'all')}
                placeholder="All Prices"
                showEmptyOption
                fullWidth
              />
            </div>

            <div className="explore-strip-group">
              <span className="explore-strip-label">Sort By</span>
              <CustomDropdown
                options={sortOptions}
                value={sort}
                onChange={setSort}
                placeholder="Featured Curation"
                showEmptyOption
                fullWidth
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="explore-strip-reset"
                onClick={resetAllFilters}
                title="Reset filters"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            className="explore-mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {hasActiveFilters && <span className="explore-dot" />}
          </button>
        </div>

        {/* ── 3. Product Grid: Exactly 4 Products Per Row ─────────── */}
        <section className="explore-grid-section">
          {filteredItems.length === 0 ? (
            <div className="explore-empty-minimal">
              <h2 className="explore-empty-minimal__title">No creations match your filters</h2>
              <p className="explore-empty-minimal__desc">
                Try relaxing your filter criteria to view our handcrafted treasures.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={resetAllFilters}
                style={{ marginTop: '20px' }}
              >
                View All Creations
              </button>
            </div>
          ) : (
            <div className="explore-4col-grid">
              {filteredItems.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── 4. Mobile Filter Drawer ───────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="explore-mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="explore-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="explore-mobile-drawer__header">
              <span className="explore-mobile-drawer__title">Filter & Sort</span>
              <button
                type="button"
                className="explore-mobile-drawer__close"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="explore-mobile-drawer__body">
              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Category</label>
                <div className="explore-drawer-pills">
                  <button
                    type="button"
                    className={`explore-drawer-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All ({products.length})
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`explore-drawer-pill ${selectedCategory === c.id ? 'is-active' : ''}`}
                      onClick={() => setSelectedCategory(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Fabric</label>
                <CustomDropdown
                  options={fabricOptions}
                  value={selectedFabric}
                  onChange={setSelectedFabric}
                  placeholder="All Fabrics"
                  showEmptyOption
                  fullWidth
                />
              </div>

              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Price</label>
                <CustomDropdown
                  options={priceOptions}
                  value={selectedPriceTier === 'all' ? '' : selectedPriceTier}
                  onChange={(v) => setSelectedPriceTier(v || 'all')}
                  placeholder="All Prices"
                  showEmptyOption
                  fullWidth
                />
              </div>

              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Sort</label>
                <CustomDropdown
                  options={sortOptions}
                  value={sort}
                  onChange={setSort}
                  placeholder="Featured Curation"
                  showEmptyOption
                  fullWidth
                />
              </div>
            </div>

            <div className="explore-mobile-drawer__footer">
              <button
                type="button"
                className="explore-drawer-reset-btn"
                onClick={resetAllFilters}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn btn--primary explore-drawer-apply-btn"
                onClick={() => setMobileFilterOpen(false)}
              >
                Show {filteredItems.length} pieces
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
