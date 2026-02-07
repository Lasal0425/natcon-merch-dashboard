import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange';
}

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
    const colorMap = {
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        green: "bg-green-500/10 text-green-600 dark:text-green-400",
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600 dark:text-green-400 font-medium">+{trend}%</span>
                    <span className="text-zinc-500 dark:text-zinc-400 ml-1">from last month</span>
                </div>
            )}
        </div>
    );
}
