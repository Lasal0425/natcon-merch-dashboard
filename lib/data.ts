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
        return [];
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
        return [];
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

export async function fetchEntityStats() {
    try {
        const result = await pool.query(`
            SELECT entity, COUNT(*) as count 
            FROM orders 
            GROUP BY entity 
            ORDER BY count DESC
        `);
        return result.rows.map(row => ({
            name: row.entity,
            value: Number(row.count)
        }));
    } catch (error) {
        console.error('Error fetching entity stats:', error);
        return [];
    }
}

export async function fetchItemSales() {
    try {
        const result = await pool.query(`
            SELECT item_name, SUM(quantity) as count 
            FROM order_items 
            GROUP BY item_name 
            ORDER BY count DESC
        `);
        return result.rows.map(row => ({
            name: row.item_name,
            value: Number(row.count)
        }));
    } catch (error) {
        console.error('Error fetching item sales:', error);
        return [];
    }
}

export async function fetchTshirtSizeDistribution() {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(
                    NULLIF(item_size, ''),
                    NULLIF(tshirt_size, ''),
                    substring(item_name from '\\(([^)]+)\\)')
                ) as size,
                SUM(quantity) as count
            FROM order_items
            WHERE 
                COALESCE(
                    NULLIF(item_size, ''),
                    NULLIF(tshirt_size, ''),
                    substring(item_name from '\\(([^)]+)\\)')
                ) IS NOT NULL
            GROUP BY size
        `);
        const sizeOrder = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
        return result.rows
            .map(row => ({
                name: row.size,
                value: Number(row.count)
            }))
            .sort((a, b) => {
                const indexA = sizeOrder.indexOf(a.name.toUpperCase());
                const indexB = sizeOrder.indexOf(b.name.toUpperCase());
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });
    } catch (error) {
        console.error('Error fetching tshirt size distribution:', error);
        return [];
    }
}
