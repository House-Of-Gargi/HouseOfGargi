'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'INR' | 'GBP' | 'EUR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromINR: number;
  flag: string;
  format: (amount: number) => string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateFromINR: 1 / 83,
    flag: '🇺🇸',
    format: (amount) => `$${amount.toLocaleString('en-US')}`,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rateFromINR: 1,
    flag: '🇮🇳',
    format: (amount) => `₹${amount.toLocaleString('en-IN')}`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateFromINR: 1 / 106,
    flag: '🇬🇧',
    format: (amount) => `£${amount.toLocaleString('en-GB')}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateFromINR: 1 / 90,
    flag: '🇪🇺',
    format: (amount) => `€${amount.toLocaleString('de-DE')}`,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    rateFromINR: 1 / 22.6,
    flag: '🇦🇪',
    format: (amount) => `AED ${amount.toLocaleString('en-AE')}`,
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (priceInINR: number, options?: { showCode?: boolean; showApprox?: boolean }) => string;
  convertPrice: (priceInINR: number) => number;
  config: CurrencyConfig;
  allCurrencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'gargi_currency_preference';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Default is USD as requested by user
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        setCurrencyState(saved);
      }
    } catch {
      // ignore storage errors
    }
    setMounted(true);
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    if (!CURRENCIES[c]) return;
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  };

  const currentConfig = CURRENCIES[currency] || CURRENCIES.USD;

  const convertPrice = (priceInINR: number): number => {
    if (currency === 'INR') return priceInINR;
    // Luxury clean rounding to whole integer
    return Math.round(priceInINR * currentConfig.rateFromINR);
  };

  const formatPrice = (
    priceInINR: number,
    options?: { showCode?: boolean; showApprox?: boolean }
  ): string => {
    const converted = convertPrice(priceInINR);
    const formatted = currentConfig.format(converted);
    const codePart = options?.showCode ? ` ${currentConfig.code}` : '';

    if (options?.showApprox && currency !== 'INR') {
      const inrStr = `₹${priceInINR.toLocaleString('en-IN')}`;
      return `${formatted}${codePart} (approx. ${inrStr})`;
    }

    return `${formatted}${codePart}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        config: currentConfig,
        allCurrencies: Object.values(CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback safe defaults if used outside provider during SSR
    return {
      currency: 'USD',
      setCurrency: () => {},
      formatPrice: (priceInINR: number) => `$${Math.round(priceInINR / 83).toLocaleString('en-US')}`,
      convertPrice: (priceInINR: number) => Math.round(priceInINR / 83),
      config: CURRENCIES.USD,
      allCurrencies: Object.values(CURRENCIES),
    };
  }
  return context;
}
