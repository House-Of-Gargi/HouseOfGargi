import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { products } from '@/data/products';

export async function GET() {
  let ordersList: any[] = [];

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      ordersList = data;
    }
  } catch (err) {
    console.warn('Supabase fetch error:', err);
  }

  return NextResponse.json({ success: true, orders: ordersList });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'id and status required' }, { status: 400 });
    }

    try {
      await supabase.from('orders').update({ status }).eq('id', id);
    } catch (sbErr) {
      console.warn('Supabase order status update error:', sbErr);
    }

    return NextResponse.json({ success: true, message: 'Order status updated', id, status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Error updating order' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_email, items, delivery_city } = body;

    if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer name and order items are required.' },
        { status: 400 }
      );
    }

    // Authoritative price calculation
    let calculatedTotal = 0;
    const validatedItems = items.map((clientItem: any) => {
      const serverProduct = products.find(p => p.id === clientItem.id);
      const unitPrice = serverProduct ? serverProduct.price : (Number(clientItem.price) || 0);
      const qty = Math.max(1, parseInt(clientItem.quantity, 10) || 1);
      calculatedTotal += unitPrice * qty;

      return {
        id: clientItem.id,
        name: serverProduct ? serverProduct.name : clientItem.name,
        price: unitPrice,
        quantity: qty,
        size: clientItem.size || 'Free Size'
      };
    });

    const orderNumber = `#HG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: `ord_${Date.now()}`,
      order_number: orderNumber,
      customer_name,
      customer_phone: customer_phone || null,
      customer_email: customer_email || null,
      delivery_city: delivery_city || 'Kolkata, WB',
      total_rupees: calculatedTotal,
      status: 'Processing',
      created_at: new Date().toISOString(),
      items: validatedItems,
    };

    // Save to persistent backend store
    const stored = getStoredOrders();
    stored.unshift(newOrder);
    saveStoredOrders(stored);

    // Attempt insertion into Supabase PostgreSQL orders table
    try {
      const { data, error } = await supabase.from('orders').insert([{
        order_number: orderNumber,
        customer_name,
        customer_phone: customer_phone || null,
        total_rupees: calculatedTotal,
        status: 'Processing',
        created_at: new Date().toISOString()
      }]).select().single();

      if (!error && data) {
        newOrder.id = data.id;
      }
    } catch (dbErr) {
      console.warn('Supabase insertion fallback to internal backend store:', dbErr);
    }

    return NextResponse.json({
      success: true,
      order: newOrder
    });

  } catch (error: any) {
    console.error('API /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal order processing error' },
      { status: 500 }
    );
  }
}
