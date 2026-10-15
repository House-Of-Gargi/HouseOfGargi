'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CustomDropdown from '@/components/CustomDropdown';
import { TOP_3_SEARCH_TERMS, saveSearchHistory } from '@/components/SearchDropdown';

import { Product } from '@/types';

export default function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialFabric = searchParams.get('fabric') || '';
  const initialSort = searchParams.get('sort') || '';
  const initialPriceTier = searchParams.get('price') || 'all';
  const highlightedProductId = searchParams.get('id') || '';

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFabric, setSelectedFabric] = useState(initialFabric);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedPriceTier, setSelectedPriceTier] = useState(initialPriceTier);

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [liveProducts, setLiveProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setLiveProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const activeProducts = useMemo(() => {
    return liveProducts || products;
  }, [liveProducts]);

  // Sync state if URL search params change
  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Derived filter options from catalog
  const allFabrics = useMemo(() => {
    return Array.from(new Set(activeProducts.map(p => p.fabric))).filter(Boolean);
  }, [activeProducts]);

  const fabricOptions = useMemo(() => {
    return allFabrics.map(f => ({ value: f, label: f }));
  }, [allFabrics]);

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

  // Filter & sort logic with smart synonyms
  const filteredProducts = useMemo(() => {
    let result = [...activeProducts];

    // Search query filter with smart synonyms
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      const queryTerms = [q];
      if (q.includes('kurti')) queryTerms.push('kurta', 'kurta-sets');
      if (q.includes('kurta')) queryTerms.push('kurti');
      if (q.includes('jewel')) queryTerms.push('accessories', 'necklace', 'jhumka', 'choker');
      if (q.includes('saree') || q.includes('sari')) queryTerms.push('saree', 'sarees');

      result = result.filter(p => {
        const fullText = `${p.name} ${p.category} ${p.fabric} ${p.technique} ${p.artisanName || ''} ${p.region} ${p.occasion} ${p.description}`.toLowerCase();
        return queryTerms.some(term => fullText.includes(term));
      });
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Fabric filter
    if (selectedFabric) {
      result = result.filter(p => p.fabric.toLowerCase().includes(selectedFabric.toLowerCase()));
    }

    // Price tier filter
    if (selectedPriceTier === 'under-15k') {
      result = result.filter(p => p.price < 15000);
    } else if (selectedPriceTier === '15k-40k') {
      result = result.filter(p => p.price >= 15000 && p.price <= 40000);
    } else if (selectedPriceTier === 'above-40k') {
      result = result.filter(p => p.price > 40000);
    }

    // Sort order
    if (selectedSort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    // If a product was directly selected from the dropdown, prioritize it at the top
    if (highlightedProductId) {
      const matchIndex = result.findIndex(p => p.id === highlightedProductId);
      if (matchIndex > 0) {
        const [target] = result.splice(matchIndex, 1);
        result.unshift(target);
      }
    }

    return result;
  }, [searchTerm, selectedCategory, selectedFabric, selectedPriceTier, selectedSort, highlightedProductId]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    (selectedCategory && selectedCategory !== 'all') ||
    selectedFabric ||
    (selectedPriceTier && selectedPriceTier !== 'all') ||
    selectedSort
  );

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedFabric('');
    setSelectedPriceTier('all');
    setSelectedSort('');
    router.push('/explore');
  };

  return (
    <div className="explore-page">
      <div className="container">
        {/* ── 1. First: "Results for :" Header ────────────────────── */}
        <div className="explore-header-row">
          <div className="explore-results-title-wrap">
            <span className="explore-results-label">Results for :</span>
            <span className="explore-results-query">
              {searchTerm ? `"${searchTerm}"` : 'All Creations'}
            </span>
            <span className="explore-results-count">
              ({filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'})
            </span>
            {searchTerm && (
              <button
                type="button"
                className="explore-results-clear"
                onClick={() => { setSearchTerm(''); router.push('/explore'); }}
                title="Clear search"
              >
                Clear <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* ── 2. Then: Clean Filter Strip with CustomDropdown ─────── */}
        <div className="explore-filter-strip">
          <div className="explore-filter-strip__left">
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
                value={selectedSort}
                onChange={setSelectedSort}
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

          {/* Mobile Filter & Quick Sort Controls */}
          <div className="explore-mobile-controls">
            <button
              type="button"
              className="explore-mobile-filter-btn"
              onClick={() => setMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {hasActiveFilters && <span className="explore-dot" />}
            </button>
            <div className="explore-mobile-sort-wrap">
              <CustomDropdown
                options={sortOptions}
                value={selectedSort}
                onChange={setSelectedSort}
                placeholder="Sort: Featured"
                showEmptyOption={false}
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* ── 3. Product Grid: Exactly 4 Products Per Row using ProductCard ── */}
        <section className="explore-grid-section">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="explore-empty-minimal">
              <h2 className="explore-empty-minimal__title">No creations found</h2>
              <p className="explore-empty-minimal__desc">
                Try searching one of our top categories:
              </p>
              <div className="explore-empty-minimal__pills">
                {TOP_3_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="explore-empty-minimal__pill"
                    onClick={() => {
                      setSearchTerm(term);
                      saveSearchHistory(term);
                      router.push(`/explore?q=${encodeURIComponent(term)}`);
                    }}
                  >
                    {term} <ArrowRight size={12} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn--primary"
                onClick={resetAllFilters}
                style={{ marginTop: '20px' }}
              >
                View All Pieces
              </button>
            </div>
          ) : (
            <div className="explore-4col-grid">
              {filteredProducts.map(product => (
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
                  value={selectedSort}
                  onChange={setSelectedSort}
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
                Show {filteredProducts.length} pieces
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
