'use client';

import './SkeletonShimmer.css';

export default function StorefrontSkeleton() {
  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', background: '#FBF6EE', paddingBottom: '70px' }}>
      <div className="skeleton-category-container">
        {/* Banner shimmer */}
        <div className="royal-skeleton" style={{ width: '100%', height: '140px', borderRadius: '14px', marginBottom: '32px' }} />

        {/* Product Cards Grid */}
        <div className="skeleton-card-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-product-card">
              <div className="royal-skeleton skeleton-card-image" />
              <div className="skeleton-card-body">
                <div className="royal-skeleton" style={{ width: '75%', height: '18px' }} />
                <div className="royal-skeleton" style={{ width: '40%', height: '18px' }} />
                <div className="royal-skeleton" style={{ width: '88%', height: '13px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
