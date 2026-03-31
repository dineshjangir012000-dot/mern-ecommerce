import { Users, ShoppingCart, DollarSign, Package, TrendingUp, ArrowUpRight } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { PageHeader } from '@/components/admin/PageHeader';
// import { StatusBadge } from '@/components/admin/StatusBadge';
// import { mockDashboardStats, mockOrders } from '@/data/mockData';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
// import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import {API_BASE_URL} from "../apihelper.ts"
import { useEffect, useState } from 'react';

export default function Dashboard() {
  // const stats = mockDashboardStats;
  // const recentOrders = mockOrders.slice(0, 5);
  const [dashboardData, setDashboardData] = useState(
    {
      totalUsers : 0,
      totalProducts : 0,
      totalOrders : 0,
      totalRevenue : 0
    }
  );
  const [loading, setLoading] = useState(true)
  const admintoken = localStorage.getItem("admintoken")
  console.log("admintoken", admintoken);

  const getDashboardStats = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {headers: {Authorization : `Bearer ${admintoken}`}})

      console.log("resopnse", res)

      if(res.data.status){
        toast.success(res.data.message);
        setDashboardData(res.data.data);
      }

    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    if(!admintoken){
      toast.error("Unauthorized")
      return
    }
    getDashboardStats();
  }, [])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your store's performance"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers.toLocaleString()}
          // change={stats.userGrowth}
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders.toLocaleString()}
          // change={stats.orderGrowth}
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue.toLocaleString()}`}
          // change={stats.revenueGrowth}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Total Products"
          value={dashboardData.totalProducts.toLocaleString()}
          icon={Package}
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        {/* <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Sales Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly sales performance</p>
            </div>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="date" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Orders Chart */}
        {/* <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Orders Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly order count</p>
            </div>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="date" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value, 'Orders']}
                />
                <Bar dataKey="orders" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        {/* <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Orders</h3>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{order.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${order.total.toFixed(2)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Best Selling Products */}
        {/* <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Best Selling Products</h3>
            <Link
              to="/admin/products"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {mockBestSellers.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-muted-foreground">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{product.sold} sold</p>
                  <p className="text-sm text-muted-foreground">
                    ${product.discountedPrice || product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
