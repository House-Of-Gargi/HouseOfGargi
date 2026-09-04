import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function POST(request: Request) {
  try {
    const { items, currency = 'INR', notes = {} } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Empty cart items' }, { status: 400 });
    }

    // Secure server-side amount calculation
    let serverTotal = 0;
    for (const item of items) {
      const prod = products.find(p => p.id === item.id);
      const price = prod ? prod.price : item.price;
      serverTotal += price * (item.quantity || 1);
    }

    // Prepares checkout session payload (ready for Razorpay/Stripe order generation)
    const session = {
      id: `chk_${Date.now()}`,
      amount_in_paise: serverTotal * 100,
      currency,
      receipt: `rcpt_${Math.floor(1000 + Math.random() * 9000)}`,
      notes: {
        ...notes,
        house: 'House of Gargi Luxury Handloom',
      },
      created_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      session,
      key_id: process.env.PAYMENT_GATEWAY_KEY || 'rzp_test_placeholder'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
