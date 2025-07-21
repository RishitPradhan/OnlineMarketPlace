import React, { useEffect, useState } from 'react';
import { fetchUnreadNotifications } from '../dashboard/Dashboard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface NotificationItem {
  id: string;
  type: 'message';
  from: string; // sender_id
  content: string;
  created_at: string;
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [senderMap, setSenderMap] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const fetchAndMark = async () => {
      const notes = await fetchUnreadNotifications(user.id);
      const casted = notes.map(n => ({ ...n, type: 'message' as const }));
      if (mounted) setNotifications(casted);
      // Mark all as read
      if (notes.length > 0) {
        const ids = notes.map(n => n.id);
        await supabase.from('messages').update({ unread: false }).in('id', ids);
      }
      // Fetch sender names
      const uniqueSenderIds = Array.from(new Set(notes.map(n => n.from)));
      if (uniqueSenderIds.length > 0) {
        const { data } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .in('id', uniqueSenderIds);
        const map: { [id: string]: string } = {};
        if (data) {
          data.forEach((u: any) => {
            map[u.id] = (u.first_name || '') + ' ' + (u.last_name || '');
          });
        }
        if (mounted) setSenderMap(map);
      }
    };
    fetchAndMark();
    return () => { mounted = false; };
  }, [user]);

  const hasNotifications = notifications.length > 0;
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-lg">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      </div>
      {hasNotifications ? (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Notifications</h2>
          {notifications.map(n => (
            <div key={n.id} className="bg-white dark:bg-dark-800 rounded-lg shadow p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-green-700 dark:text-green-300">New message from {senderMap[n.from] || 'Unknown User'}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm mt-1">{n.content}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Notifications Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">You're all caught up! When you receive updates, offers, or important alerts, they'll show up here.</p>
          <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow transition-all">Explore Services</button>
        </>
      )}
    </div>
  );
};

export default NotificationsPage; 