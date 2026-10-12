import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch live tables from Supabase in parallel
    const [artisansRes, appsRes, prodsRes, ordersRes] = await Promise.all([
      supabase.from('artisan_profiles').select('*'),
      supabase.from('artisan_applications').select('*'),
      supabase.from('products').select('*'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);

    const artisanProfiles = artisansRes.data || [];
    const applications = appsRes.data || [];
    const products = prodsRes.data || [];
    const orders = ordersRes.data || [];

    // Filter applications and products
    const approvedApps = applications.filter((a: any) => a.status === 'approved');
    const pendingApps = applications.filter((a: any) => a.status === 'pending');
    const pendingProducts = products.filter((p: any) => p.curation_status === 'pending');

    // 1. Total Artisans: approved artisans from applications & artisan_profiles
    const totalArtisans = Math.max(artisanProfiles.length, approvedApps.length);

    // 2. Total Products: real products in DB
    const totalProducts = products.length;

    // 3. Total Sales: sum of orders total_rupees
    const totalSales = orders.reduce((sum: number, o: any) => sum + (Number(o.total_rupees) || 0), 0);

    // 4. Pending queues
    const pendingArtisansCount = pendingApps.length;
    const pendingProductsCount = pendingProducts.length;
    const totalPendingCount = pendingArtisansCount + pendingProductsCount;

    // 5. Daily Sales per day for last 7 days and last 30 days
    const now = new Date();

    const getDailySales = (daysCount: number) => {
      const days: any[] = [];
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        // Format short day label
        const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumberStr = d.getDate();
        const shortLabel = `${weekdayStr} ${dayNumberStr}`;
        const fullLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        // Sum real orders on this date
        const dayTotal = orders
          .filter((o: any) => o.created_at && o.created_at.startsWith(dateStr))
          .reduce((sum: number, o: any) => sum + (Number(o.total_rupees) || 0), 0);

        days.push({
          date: dateStr,
          label: fullLabel,
          shortLabel,
          sales: dayTotal,
        });
      }
      return days;
    };

    const sales7Days = getDailySales(7);
    const sales30Days = getDailySales(30);

    // 6. Top 10 Most Sold Items from products table
    const topProducts = [...products]
      .sort((a: any, b: any) => (Number(b.total_units_sold) || 0) - (Number(a.total_units_sold) || 0))
      .slice(0, 10)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price_in_rupees,
        unitsSold: Number(p.total_units_sold) || 0,
        revenue: Number(p.total_gross_revenue) || 0,
        imageUrl: p.image_url,
      }));

    // 7. Top 10 Artisans from approved artisans
    const topArtisans = approvedApps.slice(0, 10).map((a: any) => ({
      id: a.id || a.application_number,
      name: a.name,
      craft: a.type_of_art || 'Master Handloom',
      state: a.state || 'India',
      unitsSold: 0,
      totalSales: 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalArtisans,
        totalProducts,
        totalSales,
        pendingQueues: {
          total: totalPendingCount,
          pendingArtisans: pendingArtisansCount,
          pendingProducts: pendingProductsCount,
        },
        sales7Days,
        sales30Days,
        topProducts,
        topArtisans,
      },
    });
  } catch (err: any) {
    console.error('Error calculating admin dashboard stats:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Error fetching stats' },
      { status: 500 }
    );
  }
}
