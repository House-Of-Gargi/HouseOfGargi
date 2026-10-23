'use client';

import './SkeletonShimmer.css';

export default function ProductDetailSkeleton() {
  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', background: '#FBF6EE', paddingBottom: '70px' }}>
      <div className="skeleton-pdp-container">
        {/* Top Nav: Breadcrumb Left, Back Button Right */}
        <div className="skeleton-pdp-top">
          <div className="royal-skeleton" style={{ width: '190px', height: '18px', borderRadius: '4px' }} />
          <div className="royal-skeleton" style={{ width: '75px', height: '32px', borderRadius: '8px' }} />
        </div>

        {/* Product Layout Grid */}
        <div className="skeleton-pdp-layout">
          {/* Left Column: Gallery */}
          <div>
            <div className="royal-skeleton skeleton-pdp-gallery-main" />
            <div className="skeleton-pdp-gallery-thumbs">
              <div className="royal-skeleton skeleton-pdp-thumb" />
              <div className="royal-skeleton skeleton-pdp-thumb" />
              <div className="royal-skeleton skeleton-pdp-thumb" />
              <div className="royal-skeleton skeleton-pdp-thumb" />
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="skeleton-pdp-details">
            {/* Category Eyebrow */}
            <div className="royal-skeleton" style={{ width: '130px', height: '14px', borderRadius: '4px' }} />

            {/* Product Title */}
            <div className="royal-skeleton" style={{ width: '85%', height: '34px', borderRadius: '6px', margin: '4px 0' }} />

            {/* Price & Currency Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div className="royal-skeleton" style={{ width: '150px', height: '28px', borderRadius: '6px' }} />
              <div className="royal-skeleton" style={{ width: '110px', height: '28px', borderRadius: '6px' }} />
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(228, 211, 174, 0.45)', margin: '4px 0' }} />

            {/* Artisan Profile Card Skeleton */}
            <div style={{ 
              padding: '16px', 
              background: '#FFFFFF', 
              borderRadius: '10px', 
              border: '1px solid rgba(228, 211, 174, 0.6)',
              display: 'flex',
              gap: '14px',
              alignItems: 'center'
            }}>
              <div className="royal-skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="royal-skeleton" style={{ width: '140px', height: '14px' }} />
                <div className="royal-skeleton" style={{ width: '90px', height: '12px' }} />
              </div>
            </div>

            {/* Description Lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '6px 0' }}>
              <div className="royal-skeleton" style={{ width: '100%', height: '15px' }} />
              <div className="royal-skeleton" style={{ width: '92%', height: '15px' }} />
              <div className="royal-skeleton" style={{ width: '65%', height: '15px' }} />
            </div>

            {/* Size Selector Pills */}
            <div style={{ display: 'flex', gap: '10px', margin: '6px 0' }}>
              <div className="royal-skeleton" style={{ width: '46px', height: '44px', borderRadius: '8px' }} />
              <div className="royal-skeleton" style={{ width: '46px', height: '44px', borderRadius: '8px' }} />
              <div className="royal-skeleton" style={{ width: '46px', height: '44px', borderRadius: '8px' }} />
              <div className="royal-skeleton" style={{ width: '46px', height: '44px', borderRadius: '8px' }} />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <div className="royal-skeleton" style={{ flex: 1, height: '52px', borderRadius: '8px' }} />
              <div className="royal-skeleton" style={{ width: '52px', height: '52px', borderRadius: '8px', flexShrink: 0 }} />
            </div>

            {/* Accordion Placeholders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
              <div className="royal-skeleton" style={{ width: '100%', height: '42px', borderRadius: '6px' }} />
              <div className="royal-skeleton" style={{ width: '100%', height: '42px', borderRadius: '6px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
