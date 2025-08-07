import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const paymentDetails = location.state || {};
  const amount = paymentDetails.amount || 0;
  const paymentMethod = paymentDetails.paymentMethod || 'card';
  const transactionId = paymentDetails.transactionId || 'N/A';
  const serviceTitle = paymentDetails.serviceTitle || 'Service';
  const freelancerName = paymentDetails.freelancerName || 'Freelancer';
  const packageName = paymentDetails.packageName || 'Package';
  const orderId = paymentDetails.orderId || null;

  useEffect(() => {
    // Animate content appearance
    setTimeout(() => setShowContent(true), 300);
    setTimeout(() => setShowDetails(true), 600);
  }, []);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return '💳';
      case 'upi':
        return '🔗';
      default:
        return '💳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Success Container */}
        <div className={`glass-effect neon-border rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 ${
          showContent ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 p-8 text-center relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"></div>
              <div className="absolute top-10 right-0 w-16 h-16 bg-white rounded-full translate-x-8"></div>
              <div className="absolute bottom-0 left-1/4 w-12 h-12 bg-white rounded-full"></div>
            </div>
            
            {/* Success Icon */}
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Payment Successful!</h1>
              <p className="text-white/90 text-lg">Your order has been placed successfully</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-8">
            <div className={`transition-all duration-700 delay-300 ${
              showDetails ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              <div className="glass-effect rounded-2xl p-6 border border-green-500/20 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">Payment Summary</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getPaymentMethodIcon(paymentMethod)}</span>
                    <span className="text-gray-400 text-sm capitalize">{paymentMethod}</span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 font-medium">Service:</span>
                    <span className="text-white font-semibold">{serviceTitle}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 font-medium">Package:</span>
                    <span className="text-white font-semibold">{packageName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 font-medium">Freelancer:</span>
                    <span className="text-white font-semibold">{freelancerName}</span>
                  </div>
                  {orderId && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400 font-medium">Order ID:</span>
                      <span className="text-white font-mono text-xs bg-dark-900 px-2 py-1 rounded">
                        #{orderId.slice(0, 8)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-green-500/20">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-bold text-base">Total Amount:</span>
                      <span className="text-green-400 font-bold text-2xl">₹{amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="glass-effect rounded-2xl p-4 mb-6 border border-green-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Transaction ID:</span>
                  <span className="text-white font-mono text-xs bg-dark-900 px-2 py-1 rounded">
                    {transactionId}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/my-orders')}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-600 shadow-xl shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>View My Orders</span>
                  </div>
                </button>
                
                {orderId && (
                  <button
                    onClick={() => navigate(`/orders/${orderId}`)}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-xl shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>View Order Details</span>
                    </div>
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-4 border-2 border-green-500/30 text-gray-300 font-bold rounded-xl hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Back to Home</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Notification Footer */}
          <div className="p-6 bg-gradient-to-r from-blue-900/20 to-blue-800/10 border-t border-blue-500/20">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-400 text-sm font-medium mb-1">What's Next?</p>
                <p className="text-blue-300 text-xs">
                  You'll receive a notification when the freelancer starts working on your order. 
                  Track your order progress in the "My Orders" section.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Success Elements */}
        <div className={`fixed top-10 right-10 transition-all duration-1000 delay-1000 ${
          showContent ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'
        }`}>
          <div className="glass-effect neon-border rounded-full p-3">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 