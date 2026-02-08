import { fetchOrders, fetchMerchStats, fetchEntityStats, fetchItemSales } from '@/lib/data';
import OrderTable from '@/components/OrderTable';
import StatCard from '@/components/StatCard';
import DistributionPieChart from '@/components/DistributionPieChart';
import MerchBarChart from '@/components/MerchBarChart';
import { ShoppingBag, Users, DollarSign, Package, PieChart } from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const orders = await fetchOrders();
  const stats = await fetchMerchStats();
  const entityStats = await fetchEntityStats();
  const itemStats = await fetchItemSales();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30">
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              NatCon 2026 Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard Overview</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Welcome back. Here's what's happening with your merch sales today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
              Live Database
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${Number(stats.totalSales).toLocaleString()}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            color="blue"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DistributionPieChart
            title="Sales by Entity"
            data={entityStats}
          />
          <MerchBarChart data={itemStats} />
        </div>

        {/* Recent Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Transactions</h3>
          </div>
          <Suspense fallback={<div className="h-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />}>
            <OrderTable orders={orders} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
