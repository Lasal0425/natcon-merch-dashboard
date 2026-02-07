"use client";

import { useState } from 'react';
import { Order } from '@/lib/types';
import { format } from 'date-fns';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';

interface OrderTableProps {
    orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof Order>('order_date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleSort = (field: keyof Order) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredOrders = orders
        .filter((order) =>
            (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.order_id || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0; // Fallback
        });

    return (
        <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Orders</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full h-9 pl-9 pr-4 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50 dark:text-zinc-400">
                        <tr>
                            {[
                                { label: 'Order ID', key: 'order_id' },
                                { label: 'Customer', key: 'customer_name' },
                                { label: 'Date', key: 'order_date' },
                                { label: 'Items', key: 'total_items' },
                                { label: 'Amount', key: 'total_amount' },
                                { label: 'Status', key: 'email_sent' },
                                { label: 'In Event', key: 'attending_event' },
                                { label: '', key: 'actions' },
                            ].map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    onClick={() => column.key !== 'actions' && handleSort(column.key as keyof Order)}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.label}
                                        {column.key !== 'actions' && sortField === column.key && (
                                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredOrders.map((order) => (
                            <>
                                <tr
                                    key={order.id}
                                    className={`bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${expandedOrderId === order.id ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''}`}
                                    onClick={() => toggleExpand(order.id)}
                                >
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white whitespace-nowrap">
                                        #{order.order_id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-zinc-900 dark:text-white">{order.customer_name}</span>
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{order.customer_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-zinc-500 dark:text-zinc-400">
                                        {format(new Date(order.order_date), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-blue-600 bg-blue-100 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
                                            {order.total_items}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.email_sent ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <CheckCircle className="w-3 h-3" /> Sent
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {order.attending_event ? (
                                            <span className="text-green-500 dark:text-green-400 font-medium text-xs">Yes</span>
                                        ) : (
                                            <span className="text-zinc-400 dark:text-zinc-600 font-medium text-xs">No</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {expandedOrderId === order.id ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                    </td>
                                </tr>
                                {expandedOrderId === order.id && (
                                    <tr className="bg-zinc-50 dark:bg-zinc-800/30 border-t border-dashed border-zinc-200 dark:border-zinc-700">
                                        <td colSpan={8} className="px-6 py-4">
                                            <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900/50">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2 flex items-center gap-2">
                                                            <Info className="w-4 h-4" /> Customer Details
                                                        </h4>
                                                        <div className="grid grid-cols-[100px_1fr] gap-2">
                                                            <span className="text-zinc-500 dark:text-zinc-400">Phone:</span>
                                                            <span className="text-zinc-900 dark:text-zinc-200">{order.contact_number}</span>

                                                            <span className="text-zinc-500 dark:text-zinc-400">Address:</span>
                                                            <span className="text-zinc-900 dark:text-zinc-200">{order.home_address}</span>

                                                            <span className="text-zinc-500 dark:text-zinc-400">Entity:</span>
                                                            <span className="text-zinc-900 dark:text-zinc-200">{order.entity}</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-2 flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4" /> Order Summary
                                                        </h4>
                                                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
                                                            <p className="text-zinc-600 dark:text-zinc-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                                                                {order.order_items_summary}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                        No orders found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
