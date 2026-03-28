import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE() {
  try {
    // Delete order_items first (foreign key constraint), then orders, then merch_packs
    await pool.query('DELETE FROM order_items');
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM merch_packs');

    return NextResponse.json(
      { message: 'All transactions deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting transactions:', error);
    return NextResponse.json(
      { error: 'Failed to delete transactions' },
      { status: 500 }
    );
  }
}
