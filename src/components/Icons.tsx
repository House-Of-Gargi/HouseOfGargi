import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

export const SearchIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const WishlistIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const HeartFilledIcon = ({ size = 24, color = "currentColor", ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const CartIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export const MenuIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

export const CloseIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const DiyaIcon = ({ size = 24, strokeWidth = 1.5, className = '', ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M3 14c0 3.31 4.03 6 9 6s9-2.69 9-6" />
    <path d="M21 14H3" />
    <path className="diya-flame" d="M12 14c0-3.5-3-5.5-3-8 0-1.5 1-3 3-4 2 1 3 2.5 3 4 0 2.5-3 4.5-3 8z" />
  </svg>
);

export const StarIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export const LotusIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s-3-1-3-4c0-2.5 3-6 3-6s3 3.5 3 6c0 3-3 4-3 4z" />
    <path d="M10 18s-4-1-6-4c-1-1.5 0-3.5 0-3.5s2 1 4 2c2 1 2 5.5 2 5.5z" />
    <path d="M14 18s4-1 6-4c1-1.5 0-3.5 0-3.5s-2 1-4 2c-2 1-2 5.5-2 5.5z" />
  </svg>
);

export const ArrowRightIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export const PlusIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const MinusIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const UserIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const FileTextIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export const ShieldIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export const LeafIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
    <line x1="2" y1="22" x2="11" y2="13"></line>
  </svg>
);

export const LoomShuttleIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Traditional Weaver's Shuttle */}
    <path d="M2 12C5 8 19 8 22 12C19 16 5 16 2 12Z" />
    <ellipse cx="12" cy="12" rx="4" ry="2" />
    <line x1="12" y1="10" x2="12" y2="14" />
    <line x1="8" y1="12" x2="4" y2="12" />
    <line x1="16" y1="12" x2="20" y2="12" />
  </svg>
);

export const SpindleIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Handloom Spoke & Thread Wheel */}
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="3" x2="12" y2="9" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="3" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="21" y2="12" />
  </svg>
);

export const PaisleyIcon = ({ size = 24, strokeWidth = 1.5, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Royal Buta / Kalka Motif */}
    <path d="M12 2C7.5 2 4 6 4 10.5C4 16 9 20 14 20C18 20 20 17 20 14C20 9 14.5 9 14.5 5C14.5 3 13.5 2 12 2Z" />
    <circle cx="12" cy="13" r="2.5" />
  </svg>
);

export const AtelierSealIcon = ({ size = 32, strokeWidth = 1.2, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Concentric Royal Seal with beaded rim */}
    <circle cx="24" cy="24" r="22" strokeDasharray="2 3" />
    <circle cx="24" cy="24" r="18" />
    <circle cx="24" cy="24" r="14" strokeWidth="0.75" />
    {/* Center Diya & Lotus flame */}
    <path d="M17 28c0 3.5 3.1 5 7 5s7-1.5 7-5H17z" />
    <path d="M24 28c0-3.5-2.5-5.5-2.5-8 0-1.5.8-2.8 2.5-3.8 1.7 1 2.5 2.3 2.5 3.8 0 2.5-2.5 4.5-2.5 8z" />
  </svg>
);
