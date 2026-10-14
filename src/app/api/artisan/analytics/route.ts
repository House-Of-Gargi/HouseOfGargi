import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'src', 'data', 'backend_orders.json');
const OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'orders_overrides.json');
const PRODUCT_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'product_overrides.json');
import { products as catalogProducts } from '@/data/products';

export async function GET() {
  try {
    let orders: any[] = [];
    if (fs.existsSync(ORDERS_FILE)) {
      try {
        orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      } catch {}
    }

    let overrides: Record<string, string> = {};
    if (fs.existsSync(OVERRIDES_FILE)) {
      try {
        overrides = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
      } catch {}
    }

    let productOverrides: Record<string, any> = {};
    if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
      try {
        productOverrides = JSON.parse(fs.readFileSync(PRODUCT_OVERRIDES_FILE, 'utf8'));
      } catch {}
    }

    // Apply status overrides
    orders = orders.map((o) => ({
      ...o,
      status: overrides[o.id] || o.status,
    }));

    // Map units sold per product
    const productSalesMap: Record<string, { unitsSold: number; revenue: number }> = {};
    orders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item: any) => {
          const pid = item.id;
          const qty = Number(item.quantity) || 1;
          const lineTotal = (Number(item.price) || 0) * qty;

          if (!productSalesMap[pid]) {
            productSalesMap[pid] = { unitsSold: 0, revenue: 0 };
          }
          productSalesMap[pid].unitsSold += qty;
          productSalesMap[pid].revenue += lineTotal;
        });
      }
    });

    // Baseline catalog sales units if orders are few
    const BASELINE_SALES: Record<string, number> = {
      'banarasi-gold-weave': 24,
      'kanchipuram-temple-border': 19,
      'chanderi-floral-jaal': 28,
      'royal-zardozi-lehenga': 12,
      'paithani-peacock': 15,
      'tussar-block-print': 14,
      'gota-patti-lehenga': 9,
      'chikankari-white-kurta': 21,
    };

    // Calculate Top 5 Selling Products for this artisan
    const allProducts = catalogProducts.map((cp) => {
      const fromOrders = productSalesMap[cp.id];
      const unitsSold = (fromOrders ? fromOrders.unitsSold : 0) + (BASELINE_SALES[cp.id] || 6);
      const price = productOverrides[cp.id]?.price || cp.price;
      const revenue = unitsSold * price;
      const artisanShare = Math.round(revenue * 0.85);
      const images = productOverrides[cp.id]?.images || cp.images || ['/images/category-sarees.png'];

      let cleanCategory = 'Sarees';
      const c = (cp.category || '').toLowerCase();
      if (c.includes('lehenga')) cleanCategory = 'Lehengas';
      else if (c.includes('kurta')) cleanCategory = 'Kurta Sets';
      else if (c.includes('accessories') || c.includes('jewel')) cleanCategory = 'Accessories';

      return {
        id: cp.id,
        name: productOverrides[cp.id]?.name || cp.name,
        category: cleanCategory,
        price,
        unitsSold,
        revenue,
        artisanShare,
        imageUrl: images[0] || '/images/category-sarees.png',
      };
    });

    const top5Products = [...allProducts]
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Compute Daily Sales for 7 Days and 30 Days
    const now = new Date('2026-10-15T12:00:00.000Z');

    const getDailySales = (daysCount: number) => {
      const days: any[] = [];
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = d.getDate();
        const shortLabel = i === 0 ? 'Today' : `${weekdayStr} ${dayNum}`;
        const fullLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        // Sum orders matching this date
        const matchingOrders = orders.filter((o) => o.created_at && o.created_at.startsWith(dateStr));
        const dayTotal = matchingOrders.reduce((sum, o) => sum + (Number(o.total_rupees) || 0), 0);
        const dayUnits = matchingOrders.reduce((sum, o) => {
          if (Array.isArray(o.items)) {
            return sum + o.items.reduce((s: number, it: any) => s + (Number(it.quantity) || 1), 0);
          }
          return sum + 1;
        }, 0);

        days.push({
          date: dateStr,
          label: fullLabel,
          shortLabel,
          sales: dayTotal,
          units: dayUnits,
        });
      }
      return days;
    };

    const sales7Days = getDailySales(7);
    const sales30Days = getDailySales(30);

    return NextResponse.json({
      success: true,
      sales7Days,
      sales30Days,
      top5Products,
      ordersCount: orders.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error computing analytics' },
      { status: 500 }
    );
  }
}
