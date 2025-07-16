import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center animate-fadein">
      <div className="glass-effect neon-border rounded-xl p-12 text-center shadow-2xl transition-all duration-700">
        <h1 className="text-4xl font-bold text-white mb-6">Analytics 📊</h1>
        <p className="text-lg text-green-400 mb-8">Track your performance and growth.</p>
        <button
          onClick={() => navigate('/earnings')}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          View Earnings
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage; 