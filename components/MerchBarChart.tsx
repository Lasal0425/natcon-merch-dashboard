"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface MerchBarChartProps {
    data: { name: string; value: number }[];
}

export default function MerchBarChart({ data }: MerchBarChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col h-[400px]">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Sales by Merchandise</h3>
                <div className="flex-1 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                    No data available
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col h-[400px]">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Sales by Merchandise</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" className="dark:stroke-zinc-800" />
                        <XAxis
                            type="number"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#71717a' }}
                            allowDecimals={false}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#71717a' }}
                            width={150}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                color: '#18181b'
                            }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32}>
                            <LabelList
                                dataKey="value"
                                position="right"
                                fill="#71717a"
                                className="dark:fill-zinc-400"
                                fontSize={12}
                                fontWeight={500}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
