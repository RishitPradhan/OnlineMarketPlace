import React from 'react';
import { Card } from '../ui/Card';

export const DashboardOverview: React.FC = () => {
  const stats = [
    {
      title: 'Active Orders',
      value: '12',
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: '📦',
    },
    {
      title: 'Total Earnings',
      value: '₹2,45,000',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: '💰',
    },
    {
      title: 'Completed Gigs',
      value: '89',
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: '✅',
    },
    {
      title: 'Client Rating',
      value: '4.9',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: '⭐',
    },
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      title: 'Website Redesign',
      client: 'TechCorp Inc.',
      amount: '₹85,000',
      status: 'In Progress',
      date: '2024-01-15',
    },
    {
      id: '#ORD-002',
      title: 'Logo Design',
      client: 'StartupXYZ',
      amount: '₹30,000',
      status: 'Completed',
      date: '2024-01-14',
    },
    {
      id: '#ORD-003',
      title: 'Mobile App UI',
      client: 'InnovateLab',
      amount: '₹1,20,000',
      status: 'Review',
      date: '2024-01-13',
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-dark-950 to-dark-900 dark:from-dark-950 dark:to-dark-900 from-white to-white min-h-full">
      {/* Welcome Section */}
      <Card className="glass-effect neon-border p-6 mb-8 transform transition-transform duration-300 hover:scale-105">
        <h1 className="text-4xl font-bold text-white dark:text-white text-green-800 mb-2">
          Welcome back, Elite Freelancer! 👋
            </h1>
        <p className="text-dark-300 dark:text-dark-300 text-green-600 text-lg">
          Here's what's happening with your freelance business today.
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-300 dark:text-dark-300 text-green-600 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white dark:text-white text-green-800 mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-500 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-dark-300 dark:text-dark-300 text-green-600 text-sm ml-1">
                    from last month
                  </span>
                </div>
              </div>
              <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110">{stat.icon}</div>
                </div>
            </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
            Recent Orders
          </h3>
            <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-dark-900/50 dark:bg-dark-900/50 bg-white/50 rounded-lg border border-dark-700 dark:border-dark-700 border-green-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
              >
                    <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white dark:text-white text-green-800">
                      {order.title}
                    </h4>
                    <span className="text-sm text-dark-300 dark:text-dark-300 text-green-600">
                      {order.amount}
                    </span>
                    </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-dark-300 dark:text-dark-300 text-green-600">
                      {order.client}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Completed'
                          ? 'bg-green-500/20 text-green-400 dark:text-green-400'
                          : order.status === 'In Progress'
                          ? 'bg-yellow-500/20 text-yellow-400 dark:text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400 dark:text-blue-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            </div>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-effect neon-border p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-white dark:text-white text-green-800 mb-4">
            Quick Actions
          </h3>
            <div className="space-y-3">
            <button className="w-full p-3 text-left bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              🚀 Create New Gig
            </button>
            <button className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 dark:bg-dark-800 dark:hover:bg-dark-700 text-white dark:text-white text-green-800 border border-green-200 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              📊 View Analytics
            </button>
            <button className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 dark:bg-dark-800 dark:hover:bg-dark-700 text-white dark:text-white text-green-800 border border-green-200 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              💬 Check Messages
            </button>
            <button className="w-full p-3 text-left bg-dark-800 hover:bg-dark-700 dark:bg-dark-800 dark:hover:bg-dark-700 text-white dark:text-white text-green-800 border border-green-200 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md">
              ⚙️ Update Profile
            </button>
            </div>
        </Card>
      </div>
    </div>
  );
};