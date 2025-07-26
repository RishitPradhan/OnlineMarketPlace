import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const paymentDetails = location.state || {};
  const amount = paymentDetails.amount || 0;
  const paymentMethod = paymentDetails.paymentMethod || 'card';
  const transactionId = paymentDetails.transactionId || 'N/A';
  const serviceTitle = paymentDetails.serviceTitle || 'Service';
  const freelancerName = paymentDetails.freelancerName || 'Freelancer';
  const packageName = paymentDetails.packageName || 'Package';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-[400px] rounded-3xl bg-gray-800 shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400">Your order has been placed successfully</p>
        </div>

        {/* Order Details */}
        <div className="mb-6 p-4 bg-gray-700 rounded-xl text-left">
          <h3 className="text-white font-semibold mb-3">Order Details</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="text-white">{serviceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="text-white">{packageName}</span>
            </div>
            <div className="flex justify-between">
              <span>Freelancer:</span>
              <span className="text-white">{freelancerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="text-green-400 font-bold">₹{amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="text-white capitalize">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="text-white font-mono text-xs">{transactionId}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/my-orders')}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 border border-gray-600 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition"
          >
            Back to Home
          </button>
        </div>

        {/* Notification */}
        <div className="mt-6 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm">
            You'll receive a notification when the freelancer starts working on your order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 