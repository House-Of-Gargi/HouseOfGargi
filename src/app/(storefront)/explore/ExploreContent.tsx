'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  SlidersHorizontal, 
  Check, 
  Eye, 
  RotateCcw,
  ShoppingBag,
  Heart
} from 'lucide-react';
import { products, categories, getProduct } from '@/data/products';
import { Product } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useCart } from '@/context/CartContext';
import { TOP_3_SEARCHES, saveSearchHistory } from '@/components/SearchDropdown';

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

  const allOccasions = useMemo(() => {
    return Array.from(new Set(products.map(p => p.occasion))).filter(Boolean);
  }, []);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      result = result.filter(p => {
        const fullText = `${p.name} ${p.category} ${p.fabric} ${p.technique} ${p.artisanName || ''} ${p.region} ${p.occasion} ${p.description}`.toLowerCase();
        return fullText.includes(q);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearchHistory(searchTerm.trim());
      router.push(`/explore?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/explore');
    }
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
    setAddedToast(`Added "${product.name}" to your bag`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="explore-page">
      {/* Toast Notification */}
      {addedToast && (
        <div className="explore-toast">
          <ShoppingBag size={16} />
          <span>{addedToast}</span>
        </div>
      )}

      {/* ── 1. Luxury Explore Hero ───────────────────────────────── */}
      <section className="explore-hero">
        <div className="container">
          <div className="explore-hero__inner">
            <div className="explore-hero__badge">
              <Sparkles size={14} />
              <span>House of Gargi Atelier Curation</span>
            </div>
            <h1 className="explore-hero__title">Explore Artisanal Masterpieces</h1>
            <p className="explore-hero__subtitle">
              Immerse yourself in handloom Banarasi silks, royal bridal zardozi, ethereal Chanderi weaves, and temple heirlooms.
            </p>

            {/* In-page Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} className="explore-hero__search-box" role="search">
              <Search size={20} className="explore-hero__search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by fabric, craft, artisan or occasion (e.g. Banarasi, Zardozi, Silk)..."
                className="explore-hero__search-input"
                aria-label="Search masterpieces"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="explore-hero__search-clear"
                  onClick={() => { setSearchTerm(''); router.push('/explore'); }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="explore-hero__search-submit">
                Search
              </button>
            </form>

            {/* Quick Inspiration Pills */}
            <div className="explore-hero__suggestions">
              <span className="explore-hero__suggestions-label">Popular:</span>
              {['Banarasi Silk', 'Bridal Lehenga', 'Chanderi', 'Handloom Zari', 'Jhumka'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="explore-hero__suggestion-pill"
                  onClick={() => {
                    setSearchTerm(tag);
                    saveSearchHistory(tag);
                    router.push(`/explore?q=${encodeURIComponent(tag)}`);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Category Navigation Tabs ───────────────────────────── */}
      <section className="explore-tabs-section">
        <div className="container">
          <div className="explore-tabs-rail">
            <button
              type="button"
              className={`explore-tab-btn ${selectedCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Creations ({products.length})
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
      </section>

      {/* ── 3. Atelier Refinement & Filter Bar ───────────────────── */}
      <section className="explore-content-section section--ivory">
        <div className="container">
          {/* Active Search / Result Header */}
          <div className="explore-results-header">
            <div className="explore-results-info">
              {searchTerm ? (
                <div className="explore-query-badge">
                  <span>Results for:</span>
                  <strong>&ldquo;{searchTerm}&rdquo;</strong>
                  <button
                    type="button"
                    onClick={() => { setSearchTerm(''); router.push('/explore'); }}
                    aria-label="Remove search term"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="explore-catalog-title">
                  <span>Curated Creations</span>
                </div>
              )}
              <span className="explore-count-tag">
                Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
              </span>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              className="explore-mobile-filter-trigger"
              onClick={() => setMobileFilterOpen(true)}
              aria-label="Open filter options"
            >
              <SlidersHorizontal size={16} />
              <span>Refine & Sort</span>
              {hasActiveFilters && <span className="explore-filter-dot" />}
            </button>
          </div>

          {/* Desktop Filter Bar */}
          <div className="explore-filter-bar">
            <div className="explore-filter-bar__group">
              <label className="explore-filter-bar__label">Fabric</label>
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

            <div className="explore-filter-bar__group">
              <label className="explore-filter-bar__label">Occasion</label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="explore-select"
              >
                <option value="">All Occasions</option>
                {allOccasions.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="explore-filter-bar__group">
              <label className="explore-filter-bar__label">Price Range</label>
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

            <div className="explore-filter-bar__group">
              <label className="explore-filter-bar__label">Sort By</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="explore-select"
              >
                <option value="">Featured Curation</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Title: A to Z</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="explore-clear-all-btn"
                onClick={resetAllFilters}
              >
                <RotateCcw size={14} />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="explore-chips-row">
              <span className="explore-chips-label">Active:</span>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  className="explore-chip"
                  onClick={() => setSelectedCategory('all')}
                >
                  Category: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  <X size={12} />
                </button>
              )}
              {selectedFabric && (
                <button
                  type="button"
                  className="explore-chip"
                  onClick={() => setSelectedFabric('')}
                >
                  Fabric: {selectedFabric}
                  <X size={12} />
                </button>
              )}
              {selectedOccasion && (
                <button
                  type="button"
                  className="explore-chip"
                  onClick={() => setSelectedOccasion('')}
                >
                  Occasion: {selectedOccasion}
                  <X size={12} />
                </button>
              )}
              {selectedPriceTier !== 'all' && (
                <button
                  type="button"
                  className="explore-chip"
                  onClick={() => setSelectedPriceTier('all')}
                >
                  Price: {selectedPriceTier === 'under-15k' ? 'Under ₹15k' : selectedPriceTier === '15k-40k' ? '₹15k–₹40k' : 'Above ₹40k'}
                  <X size={12} />
                </button>
              )}
              {selectedSort && (
                <button
                  type="button"
                  className="explore-chip"
                  onClick={() => setSelectedSort('')}
                >
                  Sort: {selectedSort === 'price-asc' ? 'Low-High' : selectedSort === 'price-desc' ? 'High-Low' : 'A-Z'}
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* ── 4. Main Product Grid ──────────────────────────────── */}
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="explore-empty-state">
              <div className="explore-empty-state__icon">
                <Sparkles size={44} />
              </div>
              <h2 className="explore-empty-state__title">No Handcrafted Pieces Found</h2>
              <p className="explore-empty-state__desc">
                We could not find creations matching your exact criteria. You may reset your filters or explore our 3 most celebrated signatures below.
              </p>
              <button
                type="button"
                className="btn btn--primary explore-empty-state__reset"
                onClick={resetAllFilters}
              >
                View All Atelier Masterpieces
              </button>

              {/* Curated Top 3 Searches in Empty State */}
              <div className="explore-empty-curations">
                <div className="explore-empty-curations__header">
                  <Flame size={16} className="text-maroon" />
                  <span>Top Searched Signatures by House of Gargi</span>
                </div>
                <div className="explore-empty-curations__grid">
                  {TOP_3_SEARCHES.map(item => (
                    <div
                      key={item.id}
                      className="explore-curated-card"
                      onClick={() => {
                        setSearchTerm(item.name);
                        saveSearchHistory(item.name);
                        router.push(`/explore?q=${encodeURIComponent(item.name)}&id=${item.id}`);
                      }}
                    >
                      <div className="explore-curated-card__image">
                        <img src={item.image} alt={item.name} loading="lazy" />
                        <span className="explore-curated-card__badge">{item.badge}</span>
                      </div>
                      <div className="explore-curated-card__info">
                        <div className="explore-curated-card__name">{item.name}</div>
                        <div className="explore-curated-card__artisan">{item.artisan}</div>
                        <div className="explore-curated-card__price">{formatPrice(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="explore-grid">
                {filteredProducts.map(product => {
                  const isHighlighted = product.id === highlightedProductId;
                  const isSaved = isLoggedIn && isInWishlist(product.id);

                  return (
                    <div
                      key={product.id}
                      className={`explore-card ${isHighlighted ? 'explore-card--highlighted' : ''}`}
                    >
                      {/* Highlighted Banner */}
                      {isHighlighted && (
                        <div className="explore-card__spotlight-tag">
                          <Sparkles size={12} />
                          <span>Selected Piece</span>
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        className={`explore-card__wishlist ${isSaved ? 'is-saved' : ''}`}
                        onClick={(e) => handleWishlistClick(e, product)}
                        aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                      >
                        <Heart size={18} fill={isSaved ? 'var(--maharani-maroon)' : 'none'} />
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
                            <Eye size={15} /> Quick View
                          </button>
                        </div>
                      </Link>

                      {/* Body */}
                      <div className="explore-card__body">
                        <div className="explore-card__lineage">
                          <span className="explore-card__dot">✦</span>
                          <span>{product.artisanNote || product.region}</span>
                        </div>
                        <h3 className="explore-card__name">
                          <Link href={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        <div className="explore-card__specs">
                          <span>{product.fabric}</span>
                          <span className="explore-card__specs-divider">•</span>
                          <span>{product.technique}</span>
                        </div>
                        <div className="explore-card__footer">
                          <div className="explore-card__price">{formatPrice(product.price)}</div>
                          <button
                            type="button"
                            className="explore-card__bag-btn"
                            onClick={(e) => handleQuickAddToCart(e, product)}
                            title="Add to Bag"
                            aria-label={`Add ${product.name} to bag`}
                          >
                            <ShoppingBag size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── 5. Curated Top Searches Spotlight Section ───────── */}
              <div className="explore-curated-showcase">
                <div className="explore-curated-showcase__header">
                  <div>
                    <div className="explore-curated-showcase__pill">
                      <Flame size={14} />
                      <span>Curated by Gargi</span>
                    </div>
                    <h2 className="explore-curated-showcase__title">The 3 Coveted Signatures</h2>
                  </div>
                  <p className="explore-curated-showcase__desc">
                    Hand-picked by our atelier connoisseurs as the most searched and revered heritage creations this season.
                  </p>
                </div>

                <div className="explore-curated-showcase__grid">
                  {TOP_3_SEARCHES.map((item, index) => (
                    <div
                      key={item.id}
                      className="explore-spotlight-card"
                      onClick={() => {
                        setSearchTerm(item.name);
                        saveSearchHistory(item.name);
                        router.push(`/explore?q=${encodeURIComponent(item.name)}&id=${item.id}`);
                      }}
                    >
                      <div className="explore-spotlight-card__rank">0{index + 1}</div>
                      <div className="explore-spotlight-card__image">
                        <img src={item.image} alt={item.name} loading="lazy" />
                        <span className="explore-spotlight-card__badge">{item.badge}</span>
                      </div>
                      <div className="explore-spotlight-card__details">
                        <div className="explore-spotlight-card__category">{item.category}</div>
                        <h4 className="explore-spotlight-card__name">{item.name}</h4>
                        <div className="explore-spotlight-card__artisan">{item.artisan}</div>
                        <div className="explore-spotlight-card__footer">
                          <span className="explore-spotlight-card__price">{formatPrice(item.price)}</span>
                          <span className="explore-spotlight-card__link">
                            Explore <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── 6. Mobile Filter Drawer ───────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="explore-mobile-drawer-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="explore-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="explore-mobile-drawer__header">
              <div className="explore-mobile-drawer__title">
                <SlidersHorizontal size={18} />
                <span>Refine Collection</span>
              </div>
              <button
                type="button"
                className="explore-mobile-drawer__close"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="explore-mobile-drawer__body">
              {/* Category */}
              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Category</label>
                <div className="explore-drawer-pills">
                  <button
                    type="button"
                    className={`explore-drawer-pill ${selectedCategory === 'all' ? 'is-active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Pieces
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

              {/* Fabric */}
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

              {/* Occasion */}
              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Occasion</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="explore-select"
                >
                  <option value="">All Occasions</option>
                  {allOccasions.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Price Tier */}
              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Price Range</label>
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

              {/* Sort */}
              <div className="explore-drawer-group">
                <label className="explore-drawer-label">Sort Order</label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="explore-select"
                >
                  <option value="">Featured Curation</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Title: A to Z</option>
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
                Show {filteredProducts.length} Pieces
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. Luxury Quick View Modal ────────────────────────────── */}
      {quickViewProduct && (
        <div className="explore-modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="explore-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="explore-modal-close"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close modal"
            >
              <X size={22} />
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
                  <span className="explore-card__dot">✦</span>
                  <span>{quickViewProduct.region}</span>
                </div>
                <h3 className="explore-modal-title">{quickViewProduct.name}</h3>
                <div className="explore-modal-price">{formatPrice(quickViewProduct.price)}</div>
                
                <p className="explore-modal-desc">{quickViewProduct.description}</p>

                <div className="explore-modal-specs-list">
                  <div className="explore-modal-spec-row">
                    <strong>Artisan Lineage:</strong>
                    <span>{quickViewProduct.artisanNote || quickViewProduct.artisanName}</span>
                  </div>
                  <div className="explore-modal-spec-row">
                    <strong>Fabric & Weave:</strong>
                    <span>{quickViewProduct.fabric} ({quickViewProduct.technique})</span>
                  </div>
                  <div className="explore-modal-spec-row">
                    <strong>Occasion:</strong>
                    <span>{quickViewProduct.occasion}</span>
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
                    <ShoppingBag size={16} style={{ marginRight: '8px' }} />
                    Add to Bag
                  </button>
                  <Link
                    href={`/product/${quickViewProduct.id}`}
                    className="btn btn--secondary"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    Full Details
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
