'use client';

import { useEffect, useRef, ReactNode, CSSProperties } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function ScrollReveal({ children, className = '', style = {} }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`scroll-reveal ${className}`} 
      style={{ 
        width: '100%', 
        minWidth: 0, 
        maxWidth: '100%', 
        boxSizing: 'border-box', 
        ...style 
      }}
    >
      {children}
    </div>
  );
}
