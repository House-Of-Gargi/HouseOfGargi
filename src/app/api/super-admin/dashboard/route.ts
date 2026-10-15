import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { products as catalogProducts } from '@/data/products';

const ORDERS_FILE = path.join(process.cwd(), 'src', 'data', 'backend_orders.json');
const CATEGORIES_FILE = path.join(process.cwd(), 'src', 'data', 'categories.json');
const ADMINS_FILE = path.join(process.cwd(), 'src', 'data', 'platform_admins.json');
const PRODUCT_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'product_overrides.json');

function getStoredOrders(): any[] {
  if (fs.existsSync(ORDERS_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
}

function getStoredCategories(): any[] {
  if (fs.existsSync(CATEGORIES_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
}

function getStoredAdmins(): any[] {
  if (fs.existsSync(ADMINS_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
}

function getProductOverrides(): Record<string, any> {
  if (fs.existsSync(PRODUCT_OVERRIDES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCT_OVERRIDES_FILE, 'utf8'));
    } catch {}
  }
  return {};
}

export async function GET() {
  try {
    // 1. Fetch live tables from Supabase in parallel
    const [ordersRes, prodsRes, userRolesRes] = await Promise.allSettled([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*'),
      supabase.from('user_roles').select('*').in('role', ['admin', 'super_admin']),
    ]);

    // Live Orders
    let orders: any[] = [];
    if (ordersRes.status === 'fulfilled' && ordersRes.value.data && ordersRes.value.data.length > 0) {
      orders = ordersRes.value.data;
    } else {
      orders = getStoredOrders();
    }

    // Live Products
    let supabaseProducts: any[] = [];
    if (prodsRes.status === 'fulfilled' && prodsRes.value.data && prodsRes.value.data.length > 0) {
      supabaseProducts = prodsRes.value.data;
    }

    // Admins count
    let adminsCount = getStoredAdmins().length || 4;
    if (userRolesRes.status === 'fulfilled' && userRolesRes.value.data && userRolesRes.value.data.length > 0) {
      adminsCount = Math.max(adminsCount, userRolesRes.value.data.length);
    }

    // Categories count
    const categories = getStoredCategories();
    const categoriesCount = categories.length || 5;

    // Calculate real product sales map from orders
    const salesMap: Record<string, number> = {};
    const revenueMap: Record<string, number> = {};
    orders.forEach((o: any) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((it: any) => {
          const qty = Number(it.quantity) || 1;
          const price = Number(it.price) || 0;
          salesMap[it.id] = (salesMap[it.id] || 0) + qty;
          revenueMap[it.id] = (revenueMap[it.id] || 0) + (price * qty);
        });
      }
    });

    // Merge catalog and Supabase products
    const productOverrides = getProductOverrides();
    const allProductsMap = new Map<string, any>();

    catalogProducts.forEach((p) => {
      const overrides = productOverrides[p.id] || {};
      allProductsMap.set(p.id, {
        id: p.id,
        name: overrides.name || p.name,
        category: overrides.category || p.category,
        price: overrides.price || p.price,
        unitsSold: salesMap[p.id] || 0,
        revenue: revenueMap[p.id] || ((salesMap[p.id] || 0) * (overrides.price || p.price)),
        imageUrl: overrides.images?.[0] || p.images?.[0] || '/images/category-sarees.png',
        isFeatured: overrides.isFeatured ?? false,
      });
    });

    supabaseProducts.forEach((sp) => {
      const overrides = productOverrides[sp.id] || {};
      const existing = allProductsMap.get(sp.id);
      allProductsMap.set(sp.id, {
        id: sp.id,
        name: overrides.name || sp.name || existing?.name,
        category: overrides.category || sp.category || existing?.category || 'sarees',
        price: overrides.price || sp.price_in_rupees || existing?.price || 0,
        unitsSold: (Number(sp.total_units_sold) || 0) + (salesMap[sp.id] || 0),
        revenue: (Number(sp.total_gross_revenue) || 0) + (revenueMap[sp.id] || 0),
        imageUrl: overrides.images?.[0] || sp.image_url || existing?.imageUrl || '/images/category-sarees.png',
        isFeatured: overrides.isFeatured ?? existing?.isFeatured ?? false,
      });
    });

    const allProductsList = Array.from(allProductsMap.values());
    const totalProductsCount = allProductsList.length;

    // Financial calculations
    const totalGmv = orders.reduce((sum: number, o: any) => sum + (Number(o.total_rupees) || 0), 0);
    const platformTakeRate = Math.round(totalGmv * 0.15); // 15% platform take-rate
    const artisanPayouts = totalGmv - platformTakeRate; // 85% to artisan weavers
    const totalOrdersCount = orders.length;
    const completedOrdersCount = orders.filter((o: any) => o.status === 'delivered' || o.status === 'completed').length;
    const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalGmv / totalOrdersCount) : 0;

    // Top selling products sorted by units sold
    const topProducts = [...allProductsList]
      .sort((a, b) => b.unitsSold - a.unitsSold || b.price - a.price)
      .slice(0, 5);

    // Recent 5 live orders
    const recentOrders = orders.slice(0, 5).map((o: any) => ({
      id: o.id,
      customerName: o.customer_name || 'Valued Patron',
      customerEmail: o.customer_email || 'patron@houseofgargi.com',
      totalRupees: Number(o.total_rupees) || 0,
      platformCut: Math.round((Number(o.total_rupees) || 0) * 0.15),
      status: o.status || 'confirmed',
      createdAt: o.created_at || new Date().toISOString(),
      itemCount: Array.isArray(o.items) ? o.items.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0) : 1,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalGmv,
        platformTakeRate,
        artisanPayouts,
        totalOrdersCount,
        completedOrdersCount,
        averageOrderValue,
        totalProductsCount,
        adminsCount,
        categoriesCount,
        topProducts,
        recentOrders,
      },
    });
  } catch (err: any) {
    console.error('Super Admin Dashboard API error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching super admin dashboard' },
      { status: 500 }
    );
  }
}
