import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { products as catalogProducts } from '@/data/products';

const ORDERS_FILE = path.join(process.cwd(), 'src', 'data', 'backend_orders.json');

function getStoredOrders(): any[] {
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
}

export async function GET() {
  try {
    // 1. Fetch live orders from Supabase
    let orders: any[] = [];
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        orders = data;
      }
    } catch {}

    if (orders.length === 0) {
      orders = getStoredOrders();
    }

    // Financial calculations
    const gmvTotalRupees = orders.reduce((sum: number, o: any) => sum + (Number(o.total_rupees) || 0), 0);
    const platformCommissionRupees = Math.round(gmvTotalRupees * 0.15); // 15% platform take-rate
    const artisanSettlementsRupees = gmvTotalRupees - platformCommissionRupees; // 85% to artisans
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(gmvTotalRupees / totalOrders) : 0;

    // Dynamic Regional Distribution calculation based on catalog and orders
    const regionTotals: Record<string, number> = {
      'Varanasi Silk Guild': 0,
      'Kanchipuram Brocade': 0,
      'Chanderi Handloom': 0,
      'Lucknow Chikankari': 0,
      'Paithani Atelier': 0,
    };

    // Calculate regional weights from actual catalog
    catalogProducts.forEach((p) => {
      const region = p.region || 'India';
      if (region.includes('Varanasi') || p.category === 'sarees') {
        regionTotals['Varanasi Silk Guild'] += p.price;
      } else if (region.includes('Tamil') || region.includes('Kanchi')) {
        regionTotals['Kanchipuram Brocade'] += p.price;
      } else if (region.includes('Madhya') || region.includes('Chanderi') || p.category === 'kurta-sets') {
        regionTotals['Chanderi Handloom'] += p.price;
      } else if (region.includes('Uttar') || region.includes('Awadh') || region.includes('Lucknow')) {
        regionTotals['Lucknow Chikankari'] += p.price;
      } else {
        regionTotals['Paithani Atelier'] += p.price;
      }
    });

    const totalCatalogWeight = Object.values(regionTotals).reduce((a, b) => a + b, 0) || 1;
    const craftRegionDistribution = Object.entries(regionTotals).map(([region, weight]) => {
      const pct = Math.round((weight / totalCatalogWeight) * 1000) / 10;
      const gmvPart = gmvTotalRupees > 0 ? Math.round((gmvTotalRupees * pct) / 100) : 0;
      return {
        region,
        percentage: pct,
        gmv: gmvPart,
      };
    }).sort((a, b) => b.percentage - a.percentage);

    // Orders Ledger records
    const ordersLedger = orders.map((o: any) => {
      const total = Number(o.total_rupees) || 0;
      const commission = Math.round(total * 0.15);
      const artisanPayout = total - commission;
      const itemCount = Array.isArray(o.items)
        ? o.items.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0)
        : 1;

      return {
        id: o.id,
        customerName: o.customer_name || 'Valued Patron',
        customerEmail: o.customer_email || 'patron@houseofgargi.com',
        itemCount,
        totalRupees: total,
        platformCommission: commission,
        artisanSettlement: artisanPayout,
        status: o.status || 'confirmed',
        createdAt: o.created_at || new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      gmvTotalRupees,
      platformCommissionRupees,
      artisanSettlementsRupees,
      totalOrders,
      averageOrderValue,
      craftRegionDistribution,
      ordersLedger,
    });
  } catch (err: any) {
    console.error('Super Admin Revenue API error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching revenue ledger' },
      { status: 500 }
    );
  }
}
