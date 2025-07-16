import React from 'react';

const NotificationsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-lg">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Notifications Yet</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">You're all caught up! When you receive updates, offers, or important alerts, they'll show up here.</p>
      <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow transition-all">Explore Services</button>
    </div>
  );
};

export default NotificationsPage; 