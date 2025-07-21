import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft } from 'lucide-react';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=128';

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-green-500 text-xl">Loading user...</div>;
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 to-dark-900">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">User not found.</h2>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-dark-950 dark:to-dark-900 py-8 px-0 animate-fadein">
      <div className="glass-effect rounded-3xl p-10 shadow-2xl max-w-lg w-full flex flex-col items-center text-center border border-green-100 dark:border-dark-700 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl transition-all duration-500">
        <div className="relative mb-6">
          <img src={user.avatar || DEFAULT_AVATAR} alt={(user.first_name || '') + ' ' + (user.last_name || '')} className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-lg" />
          <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-green-400 border-2 border-white dark:border-dark-900 shadow-md"></span>
        </div>
        <div className="font-extrabold text-3xl text-gray-900 dark:text-white mb-2 tracking-tight leading-tight drop-shadow-lg">
          {(user.first_name || 'Unknown')} {(user.last_name || '')}
        </div>
        <span className="inline-block bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-semibold mb-2 uppercase tracking-wider shadow-sm">
          {user.role || 'User'}
        </span>
        <div className="text-gray-600 dark:text-gray-300 text-base mb-4 font-mono">{user.email || 'No email provided'}</div>
        <div className="w-16 border-t-2 border-green-200 dark:border-green-800 my-4 mx-auto" />
        {user.skills && Array.isArray(user.skills) && user.skills.length > 0 ? (
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {user.skills.map((skill: string, i: number) => (
              <span key={i} className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 px-4 py-1 rounded-full text-sm font-semibold shadow-sm border border-green-100 dark:border-green-800">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-xs mb-2">No skills listed</div>
        )}
        <button onClick={() => navigate(-1)} className="mt-6 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 