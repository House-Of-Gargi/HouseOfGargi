import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const INVENTORY_FILE = path.join(process.cwd(), 'src', 'data', 'artisan_inventory.json');

const INITIAL_INVENTORY = [
  {
    id: 'prod-01',
    title: 'Banarasi Katan Silk Kadwa Saree',
    category: 'Sarees',
    craftTechnique: 'Kadwa Pit Loom Handloom',
    stockCount: 6,
    leadTimeDays: 0,
    isOutOfStock: false,
    price: 28500,
    unitsSold: 14,
    grossRevenue: 399000,
    artisanShare: 339150,
  },
  {
    id: 'prod-02',
    title: 'Royal Zardozi Bridal Lehenga',
    category: 'Lehengas',
    craftTechnique: 'Zardozi Metal Wire Embroidery',
    stockCount: 2,
    leadTimeDays: 21,
    isOutOfStock: false,
    price: 45000,
    unitsSold: 6,
    grossRevenue: 270000,
    artisanShare: 229500,
  },
  {
    id: 'prod-03',
    title: 'Kanchipuram Pure Mulberry Korvai Saree',
    category: 'Sarees',
    craftTechnique: 'Korvai Interlocked Weft',
    stockCount: 4,
    leadTimeDays: 0,
    isOutOfStock: false,
    price: 32000,
    unitsSold: 9,
    grossRevenue: 288000,
    artisanShare: 244800,
  },
  {
    id: 'prod-04',
    title: 'Chanderi Gold Zari Handwoven Kurta Set',
    category: 'Kurta Sets',
    craftTechnique: 'Chanderi Handloom Weave',
    stockCount: 8,
    leadTimeDays: 0,
    isOutOfStock: false,
    price: 16500,
    unitsSold: 18,
    grossRevenue: 297000,
    artisanShare: 252450,
  },
  {
    id: 'prod-05',
    title: 'Paithani Peacock Asawali Silk Saree',
    category: 'Sarees',
    craftTechnique: 'Tapestry Technique Handloom',
    stockCount: 1,
    leadTimeDays: 14,
    isOutOfStock: false,
    price: 38000,
    unitsSold: 5,
    grossRevenue: 190000,
    artisanShare: 161500,
  },
];

export async function GET() {
  try {
    let inventory = INITIAL_INVENTORY;
    if (fs.existsSync(INVENTORY_FILE)) {
      try {
        inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf8'));
      } catch {}
    } else {
      const dir = path.dirname(INVENTORY_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2), 'utf8');
    }

    return NextResponse.json({ success: true, inventory });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, stockCount, isOutOfStock, leadTimeDays } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    let inventory = INITIAL_INVENTORY;
    if (fs.existsSync(INVENTORY_FILE)) {
      inventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, 'utf8'));
    }

    const idx = inventory.findIndex((item: any) => item.id === id);
    if (idx !== -1) {
      if (stockCount !== undefined) inventory[idx].stockCount = Math.max(0, Number(stockCount));
      if (isOutOfStock !== undefined) inventory[idx].isOutOfStock = Boolean(isOutOfStock);
      if (leadTimeDays !== undefined) inventory[idx].leadTimeDays = Number(leadTimeDays);

      fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2), 'utf8');
      return NextResponse.json({ success: true, item: inventory[idx] });
    }

    return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message }, { status: 500 });
  }
}
