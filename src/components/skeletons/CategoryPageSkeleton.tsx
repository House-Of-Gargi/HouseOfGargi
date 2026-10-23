'use client';

import './SkeletonShimmer.css';

export default function CategoryPageSkeleton() {
  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', background: '#FBF6EE', paddingBottom: '70px' }}>
      <div className="skeleton-category-container">
        {/* Category Header Row */}
        <div className="skeleton-category-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div className="royal-skeleton" style={{ width: '100px', height: '16px' }} />
            <div className="royal-skeleton" style={{ width: '180px', height: '32px' }} />
            <div className="royal-skeleton" style={{ width: '70px', height: '16px' }} />
          </div>
        </div>

        {/* Filter Strip */}
        <div className="skeleton-filter-strip">
          <div className="royal-skeleton" style={{ width: '130px', height: '38px', borderRadius: '8px', flexShrink: 0 }} />
          <div className="royal-skeleton" style={{ width: '150px', height: '38px', borderRadius: '8px', flexShrink: 0 }} />
          <div className="royal-skeleton" style={{ width: '120px', height: '38px', borderRadius: '8px', flexShrink: 0 }} />
        </div>

        {/* Responsive Product Cards Grid (matches 2 cols on mobile, 4 on desktop) */}
        <div className="skeleton-card-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-product-card">
              <div className="royal-skeleton skeleton-card-image" />
              <div className="skeleton-card-body">
                <div className="royal-skeleton" style={{ width: '80%', height: '18px' }} />
                <div className="royal-skeleton" style={{ width: '45%', height: '18px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="royal-skeleton" style={{ width: '12px', height: '12px', borderRadius: '2px' }} />
                  <div className="royal-skeleton" style={{ width: '85%', height: '13px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
