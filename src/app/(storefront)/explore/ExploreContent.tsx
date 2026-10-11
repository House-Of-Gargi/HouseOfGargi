'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  ShoppingBag,
  Heart,
  Eye,
  ArrowRight
} from 'lucide-react';
import { products, categories } from '@/data/products';
import { Product } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useCart } from '@/context/CartContext';
import { TOP_3_SEARCH_TERMS, TOP_3_SEARCHES, saveSearchHistory } from '@/components/SearchDropdown';

export default function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isLoggedIn, openLoginModal } = useCustomerAuth();
  const { addToCart } = useCart();

  // URL query params
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialFabric = searchParams.get('fabric') || '';
  const initialOccasion = searchParams.get('occasion') || '';
  const initialSort = searchParams.get('sort') || '';
  const initialPriceTier = searchParams.get('price') || 'all';
  const highlightedProductId = searchParams.get('id') || '';

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFabric, setSelectedFabric] = useState(initialFabric);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedPriceTier, setSelectedPriceTier] = useState(initialPriceTier);

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Sync state if URL search params change
  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Derived filter options from catalog
  const allFabrics = useMemo(() => {
    return Array.from(new Set(products.map(p => p.fabric))).filter(Boolean);
  }, []);

  // Filter & sort logic with smart synonyms
  const filteredProducts = useMemo(() => {
    let result = [...products];

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

    // Occasion filter
    if (selectedOccasion) {
      result = result.filter(p => p.occasion === selectedOccasion);
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
  }, [searchTerm, selectedCategory, selectedFabric, selectedOccasion, selectedPriceTier, selectedSort, highlightedProductId]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    (selectedCategory && selectedCategory !== 'all') ||
    selectedFabric ||
    selectedOccasion ||
    (selectedPriceTier && selectedPriceTier !== 'all') ||
    selectedSort
  );

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedFabric('');
    setSelectedOccasion('');
    setSelectedPriceTier('all');
    setSelectedSort('');
    router.push('/explore');
  };

  const handleWishlistClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    toggleWishlist(product);
  };

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const chosenSize = product.sizes && product.sizes[0] ? product.sizes[0] : null;
    addToCart(product, 1, chosenSize);
    setAddedToast(`Added "${product.name}" to bag`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="explore-page">
      {/* Toast Notification */}
      {addedToast && (
        <div className="explore-toast">
          <ShoppingBag size={15} />
          <span>{addedToast}</span>
        </div>
      )}

      {/* ── 1. Minimal Header ─────────────────────────────────────── */}
      <div className="explore-header">
        <div className="container">
          <div className="explore-header__inner">
            <div className="explore-header__titles">
              <h1 className="explore-header__title">
                {searchTerm ? (
                  <>
                    <span>Results for </span>
                    <span className="explore-header__query">&ldquo;{searchTerm}&rdquo;</span>
                  </>
                ) : selectedCategory !== 'all' ? (
                  categories.find(c => c.id === selectedCategory)?.name || 'Collection'
                ) : (
                  'Explore Collection'
                )}
              </h1>
              <span className="explore-header__count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
              </span>
            </div>

            {/* Clear search chip if searching */}
            {searchTerm && (
              <button
                type="button"
                className="explore-header__clear-btn"
                onClick={() => { setSearchTerm(''); router.push('/explore'); }}
              >
                Clear Search <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Category Tabs Rail ─────────────────────────────────── */}
      <div className="explore-tabs-bar">
        <div className="container">
          <div className="explore-tabs-rail">
            <button
              type="button"
              className={`explore-tab-btn ${selectedCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All ({products.length})
            </button>
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`explore-tab-btn ${selectedCategory === cat.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. Streamlined Compact Filter Bar ─────────────────────── */}
      <div className="explore-filters-bar">
        <div className="container">
          <div className="explore-filters-row">
            {/* Desktop Filters */}
            <div className="explore-filters-left">
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="explore-mini-select"
                aria-label="Filter by Fabric"
              >
                <option value="">Fabric: All</option>
                {allFabrics.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <select
                value={selectedPriceTier}
                onChange={(e) => setSelectedPriceTier(e.target.value)}
                className="explore-mini-select"
                aria-label="Filter by Price"
              >
                <option value="all">Price: All</option>
                <option value="under-15k">Under ₹15k</option>
                <option value="15k-40k">₹15k – ₹40k</option>
                <option value="above-40k">Above ₹40k</option>
              </select>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="explore-mini-select"
                aria-label="Sort options"
              >
                <option value="">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A–Z</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="explore-mini-reset"
                  onClick={resetAllFilters}
                  title="Reset filters"
                >
                  <RotateCcw size={12} />
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
        </div>
      </div>

      {/* ── 4. Main Product Grid ──────────────────────────────────── */}
      <section className="explore-grid-section">
        <div className="container">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="explore-empty-minimal">
              <h2 className="explore-empty-minimal__title">No pieces found</h2>
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
            <div className="explore-grid">
              {filteredProducts.map(product => {
                const isSaved = isLoggedIn && isInWishlist(product.id);

                return (
                  <div key={product.id} className="explore-card">
                    {/* Wishlist Button */}
                    <button
                      type="button"
                      className={`explore-card__wishlist ${isSaved ? 'is-saved' : ''}`}
                      onClick={(e) => handleWishlistClick(e, product)}
                      aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart size={16} fill={isSaved ? 'var(--maharani-maroon)' : 'none'} />
                    </button>

                    {/* Image Wrap */}
                    <Link href={`/product/${product.id}`} className="explore-card__image-wrap">
                      <img
                        src={(product.images && product.images[0]) || '/images/category-sarees.png'}
                        alt={product.name}
                        loading="lazy"
                      />
                      <div className="explore-card__overlay">
                        <button
                          type="button"
                          className="explore-card__quick-view-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuickViewProduct(product);
                          }}
                        >
                          <Eye size={13} /> Quick View
                        </button>
                      </div>
                    </Link>

                    {/* Body */}
                    <div className="explore-card__body">
                      <div className="explore-card__lineage">
                        <span>{product.artisanNote || product.region}</span>
                      </div>
                      <h3 className="explore-card__name">
                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                      <div className="explore-card__footer">
                        <div className="explore-card__price">{formatPrice(product.price)}</div>
                        <button
                          type="button"
                          className="explore-card__bag-btn"
                          onClick={(e) => handleQuickAddToCart(e, product)}
                          title="Add to Bag"
                          aria-label={`Add ${product.name} to bag`}
                        >
                          <ShoppingBag size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Mobile Filter Drawer ───────────────────────────────── */}
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
                <select
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="explore-select"
                >
                  <option value="">All Fabrics</option>
                  {allFabrics.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Price</label>
                <select
                  value={selectedPriceTier}
                  onChange={(e) => setSelectedPriceTier(e.target.value)}
                  className="explore-select"
                >
                  <option value="all">All Prices</option>
                  <option value="under-15k">Under ₹15,000</option>
                  <option value="15k-40k">₹15,000 – ₹40,000</option>
                  <option value="above-40k">Above ₹40,000</option>
                </select>
              </div>

              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Sort</label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="explore-select"
                >
                  <option value="">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A–Z</option>
                </select>
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

      {/* ── 6. Luxury Quick View Modal ────────────────────────────── */}
      {quickViewProduct && (
        <div className="explore-modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="explore-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="explore-modal-close"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="explore-modal-body">
              <div className="explore-modal-media">
                <img
                  src={(quickViewProduct.images && quickViewProduct.images[0]) || '/images/category-sarees.png'}
                  alt={quickViewProduct.name}
                />
              </div>
              <div className="explore-modal-details">
                <div className="explore-modal-badge">
                  <span>{quickViewProduct.category.toUpperCase()}</span>
                  <span>•</span>
                  <span>{quickViewProduct.region}</span>
                </div>
                <h3 className="explore-modal-title">{quickViewProduct.name}</h3>
                <div className="explore-modal-price">{formatPrice(quickViewProduct.price)}</div>
                
                <p className="explore-modal-desc">{quickViewProduct.description}</p>

                <div className="explore-modal-specs-list">
                  <div className="explore-modal-spec-row">
                    <strong>Artisan:</strong>
                    <span>{quickViewProduct.artisanNote || quickViewProduct.artisanName}</span>
                  </div>
                  <div className="explore-modal-spec-row">
                    <strong>Fabric:</strong>
                    <span>{quickViewProduct.fabric}</span>
                  </div>
                </div>

                <div className="explore-modal-actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    style={{ flex: 1 }}
                    onClick={(e) => {
                      handleQuickAddToCart(e, quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                  >
                    Add to Bag
                  </button>
                  <Link
                    href={`/product/${quickViewProduct.id}`}
                    className="btn btn--secondary"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    View Piece
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
