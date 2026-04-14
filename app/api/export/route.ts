import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT 
                o.order_id,
                o.customer_name,
                o.customer_email,
                o.contact_number,
                o.home_address,
                o.entity,
                o.attending_event,
                o.total_items,
                o.total_amount,
                o.order_date,
                o.order_items_summary,
                o.email_sent,
                o.has_merch_pack
            FROM orders o
            ORDER BY o.order_date DESC
        `);

        const orders = result.rows.map((row: any) => ({
            order_id: row.order_id,
            customer_name: row.customer_name,
            customer_email: row.customer_email,
            contact_number: row.contact_number,
            home_address: row.home_address,
            entity: row.entity,
            attending_event: row.attending_event ? 'Yes' : 'No',
            total_items: Number(row.total_items),
            total_amount: Number(row.total_amount),
            order_date: new Date(row.order_date).toISOString(),
            order_items_summary: row.order_items_summary,
            email_sent: row.email_sent ? 'Yes' : 'No',
            has_merch_pack: row.has_merch_pack ? 'Yes' : 'No',
        }));

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Export Error:', error);
        return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
    }
}
