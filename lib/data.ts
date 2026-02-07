import pool from './db';
import { Order, OrderItem } from './types';

export async function fetchOrders() {
    try {
        const result = await pool.query(`
      SELECT * FROM orders 
      ORDER BY order_date DESC
    `);

        return result.rows.map((row: any) => ({
            ...row,
            total_amount: Number(row.total_amount),
            order_date: new Date(row.order_date).toISOString(),
            created_at: new Date(row.created_at).toISOString(),
            updated_at: new Date(row.updated_at).toISOString(),
        })) as Order[];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch orders.');
    }
}

export async function fetchOrderItems(orderId: string) {
    try {
        const result = await pool.query(`
      SELECT * FROM order_items 
      WHERE order_id = $1
    `, [orderId]);

        return result.rows.map((row: any) => ({
            ...row,
            price: Number(row.price),
            total_price: Number(row.total_price),
            created_at: new Date(row.created_at).toISOString(),
        })) as OrderItem[];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch order items.');
    }
}

export async function fetchMerchStats() {
    try {
        const totalSales = await pool.query('SELECT SUM(total_amount) as total FROM orders');
        const totalOrders = await pool.query('SELECT COUNT(*) as count FROM orders');
        const merchPackCount = await pool.query('SELECT COUNT(*) as count FROM orders WHERE has_merch_pack = true');

        return {
            totalSales: totalSales.rows[0].total,
            totalOrders: totalOrders.rows[0].count,
            merchPacks: merchPackCount.rows[0].count
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { totalSales: 0, totalOrders: 0, merchPacks: 0 };
    }
}
