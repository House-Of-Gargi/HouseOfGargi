'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Sparkles, X, ArrowRight, ArrowUpRight, Flame } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { products } from '@/data/products';
import { Product } from '@/types';

// Exactly 3 top searched names bland pushed from our side only
export const TOP_3_SEARCH_TERMS = ['Saree', 'Kurti', 'Jewellery'] as const;

export interface TopSearchItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge: string;
  artisan: string;
}

export const TOP_3_SEARCHES: TopSearchItem[] = [
  {
    id: 'banarasi-gold-weave',
    name: 'Banarasi Gold Weave Saree',
    category: 'Sarees',
    price: 28500,
    image: '/images/category-sarees.png',
    badge: 'Iconic Weave',
    artisan: 'Varanasi Master Weavers',
  },
  {
    id: 'royal-zardozi-lehenga',
    name: 'Royal Zardozi Bridal Lehenga',
    category: 'Lehengas',
    price: 125000,
    image: '/images/category-lehengas.png',
    badge: 'Bridal Couture',
    artisan: 'Lucknow Zardozi Karigars',
  },
  {
    id: 'chanderi-floral-jaal',
    name: 'Chanderi Floral Jaal Saree',
    category: 'Sarees',
    price: 12800,
    image: '/images/products/saree-chanderi.jpg',
    badge: 'Trending Now',
    artisan: 'Chanderi Handloom Guild',
  },
];

const HISTORY_STORAGE_KEY = 'gargi_search_history';

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    return [];
  }
}

export function saveSearchHistory(query: string): string[] {
  if (typeof window === 'undefined') return [];
  const trimmed = query.trim();
  if (!trimmed) return getSearchHistory();
  try {
    const existing = getSearchHistory();
    const filtered = existing.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 5);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function removeSearchHistoryItem(query: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSearchHistory();
    const updated = existing.filter(item => item.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {}
}

interface SearchDropdownProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (productName: string, productId?: string) => void;
  isMobileModal?: boolean;
}

export default function SearchDropdown({
  searchQuery,
  setSearchQuery,
  isOpen,
  onClose,
  onSelectProduct,
  isMobileModal = false,
}: SearchDropdownProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [history, setHistory] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync search history on open
  useEffect(() => {
    if (isOpen) {
      setHistory(getSearchHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const trimmedQuery = searchQuery.trim().toLowerCase();

  // Elastic search live matching across products with synonym support
  const matchedProducts: Product[] = trimmedQuery
    ? products
        .map(p => {
          let score = 0;
          const nameLower = p.name.toLowerCase();
          const categoryLower = p.category.toLowerCase();
          const fabricLower = p.fabric.toLowerCase();
          const techniqueLower = p.technique.toLowerCase();
          const artisanLower = (p.artisanName || '').toLowerCase();
          const regionLower = p.region.toLowerCase();

          const terms = [trimmedQuery];
          if (trimmedQuery.includes('kurti')) terms.push('kurta', 'kurta-sets');
          if (trimmedQuery.includes('kurta')) terms.push('kurti');
          if (trimmedQuery.includes('jewel')) terms.push('accessories', 'necklace', 'jhumka', 'choker');
          if (trimmedQuery.includes('saree') || trimmedQuery.includes('sari')) terms.push('saree', 'sarees');

          for (const t of terms) {
            if (nameLower === t) score += 100;
            else if (nameLower.startsWith(t)) score += 60;
            else if (nameLower.includes(t)) score += 40;

            if (categoryLower.includes(t)) score += 30;
            if (fabricLower.includes(t)) score += 25;
            if (techniqueLower.includes(t)) score += 20;
            if (artisanLower.includes(t)) score += 15;
            if (regionLower.includes(t)) score += 10;
          }

          return { product: p, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product)
        .slice(0, 4)
    : [];

  const handleSelect = (term: string, productId?: string) => {
    saveSearchHistory(term);
    setSearchQuery(term);
    setHistory(getSearchHistory());
    onClose();

    if (onSelectProduct) {
      onSelectProduct(term, productId);
    } else {
      const targetUrl = productId 
        ? `/explore?q=${encodeURIComponent(term)}&id=${encodeURIComponent(productId)}`
        : `/explore?q=${encodeURIComponent(term)}`;
      router.push(targetUrl);
    }
  };

  const handleRemoveHistory = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = removeSearchHistoryItem(item);
    setHistory(updated);
  };

  const handleClearAllHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSearchHistory();
    setHistory([]);
  };

  return (
    <div
      ref={dropdownRef}
      className={isMobileModal ? 'search-dropdown search-dropdown--mobile' : 'search-dropdown'}
      role="listbox"
      aria-label="Search suggestions"
    >
      <div className="search-dropdown__inner">
        {/* If user is typing and has matches, show live elastic search results */}
        {trimmedQuery && matchedProducts.length > 0 && (
          <div className="search-dropdown__section search-dropdown__section--matched">
            <div className="search-dropdown__section-header">
              <div className="search-dropdown__title">
                <Sparkles size={16} className="search-dropdown__icon-gold" />
                <span>Matching Masterpieces ({matchedProducts.length})</span>
              </div>
            </div>
            <div className="search-dropdown__list">
              {matchedProducts.map(p => (
                <div
                  key={p.id}
                  className="search-dropdown__item search-dropdown__item--product"
                  onClick={() => handleSelect(p.name, p.id)}
                >
                  <div className="search-dropdown__item-thumb">
                    <img
                      src={(p.images && p.images[0]) || '/images/category-sarees.png'}
                      alt={p.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="search-dropdown__item-info">
                    <div className="search-dropdown__item-name">{p.name}</div>
                    <div className="search-dropdown__item-sub">
                      <span className="search-dropdown__item-category">{p.category.toUpperCase()}</span>
                      <span className="search-dropdown__dot">•</span>
                      <span className="search-dropdown__item-detail">
                        {p.fabric}{p.technique ? ` • ${p.technique}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="search-dropdown__item-price">
                    {formatPrice(p.price)}
                    <ArrowUpRight size={16} className="search-dropdown__arrow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 1: SEARCH HISTORY (Max 5 items) */}
        <div className="search-dropdown__section search-dropdown__section--history">
          <div className="search-dropdown__section-header">
            <div className="search-dropdown__title">
              <Clock size={14} className="search-dropdown__icon-taupe" />
              <span>Recent Searches</span>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                className="search-dropdown__clear-btn"
                onClick={handleClearAllHistory}
                title="Clear search history"
              >
                Clear all
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="search-dropdown__empty-history">
              <span>No recent searches yet</span>
            </div>
          ) : (
            <div className="search-dropdown__history-tags">
              {history.map((term, idx) => (
                <div
                  key={idx}
                  className="search-dropdown__history-pill"
                  onClick={() => handleSelect(term)}
                  title={term}
                >
                  <Clock size={12} className="search-dropdown__pill-icon" />
                  <span className="search-dropdown__pill-text">{term}</span>
                  <button
                    type="button"
                    className="search-dropdown__pill-remove"
                    onClick={(e) => handleRemoveHistory(e, term)}
                    aria-label={`Remove ${term} from history`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: TOP SEARCHES (Bland names: Saree, Kurti, Jewellery) */}
        <div className="search-dropdown__section search-dropdown__section--top">
          <div className="search-dropdown__section-header">
            <div className="search-dropdown__title">
              <Flame size={14} className="search-dropdown__icon-maroon" />
              <span>Top Searches</span>
            </div>
            <span className="search-dropdown__badge search-dropdown__badge--curated">Trending</span>
          </div>

          <div className="search-dropdown__top-terms">
            {TOP_3_SEARCH_TERMS.map((term, idx) => (
              <div
                key={idx}
                className="search-dropdown__top-term-pill"
                onClick={() => handleSelect(term)}
                role="button"
                tabIndex={0}
              >
                <span className="search-dropdown__term-rank">0{idx + 1}</span>
                <span className="search-dropdown__term-name">{term}</span>
                <ArrowUpRight size={13} className="search-dropdown__term-arrow" />
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
