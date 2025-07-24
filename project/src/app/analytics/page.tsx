'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { orderManagement } from '@/lib/order-management';
import { paymentManagement } from '@/lib/payment-management';
import { serviceManagement } from '@/lib/service-management';
import { EarningsSummary, OrderAnalytics, ServiceAnalytics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [orderStats, setOrderStats] = useState<OrderAnalytics | null>(null);
  const [serviceStats, setServiceStats] = useState<ServiceAnalytics | null>(null);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load earnings data
      const earningsResponse = await paymentManagement.getEarningsSummary(user.id);
      if (earningsResponse.success) {
        setEarnings(earningsResponse.data);
      }

      // Load order statistics
      const orderResponse = await orderManagement.getOrderAnalytics(user.id, user.role);
      if (orderResponse.success) {
        setOrderStats(orderResponse.data);
      }

      // Load service statistics (for freelancers)
      if (user.role === 'freelancer') {
        const serviceResponse = await serviceManagement.listServices({ freelancerId: user.id });
        if (serviceResponse.success) {
          const services = serviceResponse.data;
          const stats: ServiceAnalytics = {
            totalServices: services.length,
            activeServices: services.filter(s => s.isActive).length,
            averageRating: 4.5, // This should come from reviews
            totalViews: 1000, // This should be tracked separately
            servicesByCategory: []
          };
          setServiceStats(stats);
        }
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view analytics.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earnings?.totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{((earnings?.monthlyEarnings[0]?.amount || 0) / (earnings?.totalEarnings || 1) * 100).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orderStats?.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              {orderStats?.activeOrders} active orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((orderStats?.completedOrders || 0) / (orderStats?.totalOrders || 1) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {orderStats?.completedOrders} completed orders
            </p>
          </CardContent>
        </Card>

        {user.role === 'freelancer' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Services
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serviceStats?.activeServices}
              </div>
              <p className="text-xs text-muted-foreground">
                {serviceStats?.totalServices} total services
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="earnings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          {user.role === 'freelancer' && (
            <TabsTrigger value="services">Services</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="earnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earnings?.monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStats?.ordersByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {user.role === 'freelancer' && (
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Service Stats</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Total Services</dt>
                        <dd className="font-medium">{serviceStats?.totalServices}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Active Services</dt>
                        <dd className="font-medium">{serviceStats?.activeServices}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Average Rating</dt>
                        <dd className="font-medium">{serviceStats?.averageRating.toFixed(1)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Total Views</dt>
                        <dd className="font-medium">{serviceStats?.totalViews}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}