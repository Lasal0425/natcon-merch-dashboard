"use client";

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function ExportButton() {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            // Fetch all order data from the API
            const res = await fetch('/api/export');
            if (!res.ok) throw new Error('Failed to fetch data');
            const orders = await res.json();

            // Dynamically import xlsx to keep initial bundle small
            const XLSX = await import('xlsx');

            // Transform orders into clean rows for Excel
            const worksheetData = orders.map((order: any, index: number) => ({
                '#': index + 1,
                'Order ID': order.order_id,
                'Customer Name': order.customer_name,
                'Email': order.customer_email,
                'Contact Number': order.contact_number,
                'Home Address': order.home_address,
                'Entity': order.entity,
                'Attending Event': order.attending_event,
                'Total Items': order.total_items,
                'Total Amount ($)': order.total_amount,
                'Order Date': new Date(order.order_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
                'Items Summary': order.order_items_summary,
                'Email Sent': order.email_sent,
                'Has Merch Pack': order.has_merch_pack,
            }));

            // Create workbook and worksheet
            const worksheet = XLSX.utils.json_to_sheet(worksheetData);

            // Auto-size columns based on content
            const colWidths = Object.keys(worksheetData[0] || {}).map((key) => {
                const maxLen = Math.max(
                    key.length,
                    ...worksheetData.map((row: any) => String(row[key] ?? '').length)
                );
                return { wch: Math.min(maxLen + 2, 50) };
            });
            worksheet['!cols'] = colWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'All Orders');

            // Generate filename with current date
            const dateStr = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `NatCon_Orders_${dateStr}.xlsx`);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                       bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                       hover:from-blue-700 hover:to-indigo-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-sm hover:shadow-md transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       dark:focus:ring-offset-zinc-900"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            {loading ? 'Exporting…' : 'Export to Excel'}
        </button>
    );
}
