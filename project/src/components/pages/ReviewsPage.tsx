import React from 'react';

const ReviewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center animate-fadein">
      <div className="glass-effect neon-border rounded-xl p-12 text-center shadow-2xl transition-all duration-700">
        <h1 className="text-4xl font-bold text-white mb-6">Reviews ⭐</h1>
        <p className="text-lg text-green-400 mb-8">See what clients are saying about you.</p>
        <button
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Request a Review
        </button>
      </div>
    </div>
  );
};

export default ReviewsPage; 