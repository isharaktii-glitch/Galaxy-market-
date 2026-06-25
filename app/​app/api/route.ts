import { NextResponse } from 'next/server';
import sql from '../../neondb';

export async function GET() {
  try {
    const users = await sql`SELECT * FROM users ORDER BY id DESC`;
    const products = await sql`SELECT * FROM products ORDER BY id DESC`;
    const orders = await sql`SELECT * FROM orders ORDER BY id DESC`;
    const payouts = await sql`SELECT * FROM payouts ORDER BY id DESC`;
    const announcements = await sql`SELECT * FROM announcements ORDER BY id DESC`;

    return NextResponse.json({ users, products, orders, payouts, announcements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, ...data } = body;

    if (action === 'register') {
      const res = await sql`
        INSERT INTO users (name, email, phone, role, kyc_status) 
        VALUES (${data.name}, ${data.email}, ${data.phone}, ${data.role}, ${data.role === 'customer' ? 'pending' : 'verified'}) 
        RETURNING *`;
      return NextResponse.json(res[0]);
    }

    if (action === 'updateGlobalMarkup') {
      await sql`UPDATE products SET admin_markup_pct = ${data.pct}`;
      return NextResponse.json({ success: true });
    }

    if (action === 'updateGlobalSellerProfit') {
      await sql`UPDATE products SET seller_profit_pct = ${data.pct}`;
      return NextResponse.json({ success: true });
    }

    if (action === 'addProduct') {
      await sql`
        INSERT INTO products (title, category, base_price, listed_by) 
        VALUES (${data.title}, ${data.category}, ${data.base_price}, ${data.userId})`;
      return NextResponse.json({ success: true });
    }

    if (action === 'createOrder') {
      await sql`
        INSERT INTO orders (product_id, buyer_name, address, status, seller_id, customer_id) 
        VALUES (${data.productId}, ${data.buyerName}, ${data.address}, 'Pending', ${data.sellerId || null}, ${data.customerId || null})`;
      return NextResponse.json({ success: true });
    }

    if (action === 'updateOrderStatus') {
      await sql`UPDATE orders SET status = ${data.status}, reject_reason = ${data.reason || null} WHERE id = ${data.id}`;
      return NextResponse.json({ success: true });
    }

    if (action === 'requestPayout') {
      await sql`UPDATE users SET bank_name = ${data.bankName}, account_no = ${data.accountNo} WHERE id = ${data.userId}`;
      await sql`INSERT INTO payouts (user_id, amount, status) VALUES (${data.userId}, ${data.amount}, 'Requested')`;
      return NextResponse.json({ success: true });
    }

    if (action === 'uploadReceipt') {
      await sql`UPDATE payouts SET receipt_url = ${data.receiptUrl}, status = 'Paid' WHERE id = ${data.id}`;
      return NextResponse.json({ success: true });
    }

    if (action === 'addAnnouncement') {
      await sql`INSERT INTO announcements (target_role, message) VALUES (${data.targetRole}, ${data.message})`;
      return NextResponse.json({ success: true });
    }

    if (action === 'cancelRegistration') {
      await sql`DELETE FROM users WHERE id = ${data.id}`;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
