'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { ArrowRightIcon, ChevronRightIcon, ChevronLeftIcon } from './Icons';
import ScrollReveal from './ScrollReveal';

interface CategoryCollectionRailProps {
  categories: Category[];
}

export default function CategoryCollectionRail({ categories }: CategoryCollectionRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 15);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 15);
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scrollByCard = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    const scrollAmount = 177; // 165px card + 12px gap
    railRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="category-rail-wrapper">
      {/* Mobile scroll indicator / control button (Right arrow) */}
      {canScrollRight && (
        <button
          type="button"
          className="category-rail-arrow category-rail-arrow--right"
          onClick={() => scrollByCard('right')}
          aria-label="Next collection card"
        >
          <ChevronRightIcon size={18} strokeWidth={2.4} />
        </button>
      )}

      {/* Mobile scroll indicator / control button (Left arrow when scrolled) */}
      {canScrollLeft && (
        <button
          type="button"
          className="category-rail-arrow category-rail-arrow--left"
          onClick={() => scrollByCard('left')}
          aria-label="Previous collection card"
        >
          <ChevronLeftIcon size={18} strokeWidth={2.4} />
        </button>
      )}

      <div className="category-grid" ref={railRef}>
        {categories.map((cat, i) => (
          <ScrollReveal key={cat.id} style={{ transitionDelay: `${i * 100}ms` }}>
            <Link href={`/category/${cat.id}`} className="category-tile">
              <img src={cat.collectionTileImage || cat.image} alt={cat.name} loading="lazy" />
              <div className="category-tile__border" />
              <div className="category-tile__label">
                <h3>{cat.name}</h3>
                <span className="category-tile__explore">
                  Explore <ArrowRightIcon size={14} />
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
