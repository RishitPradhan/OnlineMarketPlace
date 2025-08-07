'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { orderManagement } from '../../../lib/order-management';
import { Order, OrderStatus } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/Badge';
import { Loader2, Clock, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      console.log('MyOrdersPage: User found, loading orders...');
      loadOrders();
    } else {
      console.log('MyOrdersPage: No user found');
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Loading orders for user:', user.id, 'role:', user.role);
      const response = await orderManagement.listOrders({
        userId: user.id,
        role: user.role as 'client' | 'freelancer',
        status: selectedStatus === 'all' ? undefined : selectedStatus
      });

      console.log('Orders response:', response);
      if (response.success && response.data) {
        setOrders(response.data);
        console.log('Orders loaded:', response.data);
      } else {
        console.error('Failed to load orders:', response.error);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await orderManagement.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        await loadOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      case 'disputed':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'disputed':
        return <AlertTriangle className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  if (!user) {
    return <div>Please log in to view your orders.</div>;
  }

  console.log('MyOrdersPage: Rendering with orders:', orders.length);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all" onClick={() => setSelectedStatus('all')}>
            All Orders
          </TabsTrigger>
          <TabsTrigger value="pending" onClick={() => setSelectedStatus('pending')}>
            Pending
          </TabsTrigger>
          <TabsTrigger value="in_progress" onClick={() => setSelectedStatus('in_progress')}>
            In Progress
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setSelectedStatus('completed')}>
            Completed
          </TabsTrigger>
          <TabsTrigger value="cancelled" onClick={() => setSelectedStatus('cancelled')}>
            Cancelled
          </TabsTrigger>
          <TabsTrigger value="disputed" onClick={() => setSelectedStatus('disputed')}>
            Disputed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
              <p className="text-gray-500">
                {selectedStatus === 'all'
                  ? 'You haven\'t placed or received any orders yet.'
                  : `You don\'t have any ${selectedStatus.replace('_', ' ')} orders.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xl">
                      {order.service?.title || `Order #${order.id.slice(0, 8)}`}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>

                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {user.role === 'client' ? 'Freelancer' : 'Client'}
                        </p>
                        <p className="font-medium">
                          {user.role === 'client'
                            ? order.freelancer 
                              ? `${order.freelancer.firstName} ${order.freelancer.lastName}`
                              : 'Freelancer'
                            : order.client
                              ? `${order.client.firstName} ${order.client.lastName}`
                              : 'Client'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">
                          ${order.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Delivery Date</p>
                        <p className="font-medium">
                          {order.deliveryDate
                            ? formatDistanceToNow(new Date(order.deliveryDate), { addSuffix: true })
                            : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {order.requirements && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Requirements</p>
                        <p className="mt-1">{order.requirements}</p>
                      </div>
                    )}

                    {user.role === 'freelancer' && order.status === 'pending' && (
                      <div className="mt-6 flex space-x-2">
                        <Button
                          onClick={() => handleStatusChange(order.id, 'in_progress')}
                        >
                          Accept Order
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                        >
                          Decline Order
                        </Button>
                      </div>
                    )}

                    {user.role === 'freelancer' && order.status === 'in_progress' && (
                      <div className="mt-6">
                        <Button
                          onClick={() => handleStatusChange(order.id, 'completed')}
                        >
                          Mark as Completed
                        </Button>
                      </div>
                    )}

                    {user.role === 'client' && order.status === 'completed' && (
                      <div className="mt-6 flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleStatusChange(order.id, 'disputed')}
                        >
                          Report Issue
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}