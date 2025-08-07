import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderManagement } from '../../lib/order-management';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileCompletionGuard } from '../common/ProfileCompletionGuard';
import { supabase } from '../../lib/supabase';

// Payment Method Card Component
const PaymentMethodCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ icon, title, subtitle, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
      isSelected
        ? 'border-green-500 glass-effect neon-border shadow-xl shadow-green-500/25'
        : 'border-green-500/30 glass-effect hover:border-green-500/50 hover:bg-green-500/5'
    }`}
  >
    <div className="flex items-center space-x-5">
      <div className={`text-3xl ${isSelected ? 'text-green-400' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-300'}`}>
          {title}
        </h3>
        <p className={`text-sm ${isSelected ? 'text-green-400' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
        isSelected ? 'border-green-500 bg-green-500 shadow-lg' : 'border-green-500/30'
      }`}>
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
        )}
      </div>
    </div>
  </div>
);

const PremiumPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet'>('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UPI form states
  const [upiId, setUpiId] = useState('');

  // Get payment details from location state
  const paymentDetails = location.state || {};
  const amount = paymentDetails.amount || 100;
  const serviceId = paymentDetails.serviceId;
  const freelancerId = paymentDetails.freelancerId;
  const serviceTitle = paymentDetails.serviceTitle || 'Professional Service';
  const packageName = paymentDetails.packageName || 'Standard Package';
  const freelancerName = paymentDetails.freelancerName || 'Professional Freelancer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (paymentMethod === 'upi') {
        if (!upiId.includes('@')) {
          throw new Error('Please enter a valid UPI ID (e.g., yourname@upi)');
        }
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create order in database with proper error handling
      let orderResult = null;
      if (user?.id) {
        try {
          // Use real data if available, otherwise use sample data
          const validServiceId = serviceId || '5b9eb8a0-0747-4b2c-a937-3e41e86e7fc4';
          const validFreelancerId = freelancerId || '32c22203-6126-4d6c-97e8-b2cf05e802af';

          // Get service delivery time if available
          let deliveryDays = 7; // Default to 7 days
          if (serviceId) {
            try {
              const { data: serviceData } = await supabase
                .from('services')
                .select('deliverytime')
                .eq('id', serviceId)
                .single();
              
              if (serviceData && serviceData.deliverytime) {
                deliveryDays = serviceData.deliverytime;
              }
            } catch (error) {
              console.warn('Could not fetch service delivery time, using default:', error);
            }
          }

          const orderData = {
            serviceId: validServiceId,
            clientId: user.id,
            freelancerId: validFreelancerId,
            amount: Number(amount),
            requirements: `Package: ${packageName}`,
            deliveryDate: new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toISOString(),
          };
          
          orderResult = await orderManagement.createOrder(orderData);
          
          if (!orderResult.success) {
            throw new Error(`Failed to create order: ${orderResult.error}`);
          }
        } catch (orderError) {
          console.error('Order creation failed:', orderError);
          console.warn('Payment successful but order creation failed:', orderError);
        }
      } else {
        console.warn('User not authenticated, skipping order creation');
      }

      // Navigate to success page with order details
      navigate('/payments/success', { 
        state: { 
          amount: amount,
          paymentMethod: paymentMethod,
          transactionId: `txn_${Date.now()}`,
          serviceTitle: serviceTitle,
          freelancerName: freelancerName,
          packageName: packageName,
          orderId: orderResult?.data?.id || null
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Complete Your Payment
            </h1>
            <p className="text-gray-400 text-lg">
              Secure payment processing for your freelance service
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="glass-effect rounded-3xl p-8 border border-green-500/30">
              <h2 className="text-2xl font-bold mb-6 text-green-400">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">Service</span>
                  <span className="font-semibold text-white">{serviceTitle}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">Package</span>
                  <span className="font-semibold text-white">{packageName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">Freelancer</span>
                  <span className="font-semibold text-white">{freelancerName}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total Amount</span>
                  <span className="text-3xl font-bold text-green-400">₹{amount}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="glass-effect rounded-3xl p-8 border border-green-500/30">
              <h2 className="text-2xl font-bold mb-6 text-green-400">Payment Method</h2>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <PaymentMethodCard
                    icon="📱"
                    title="UPI Payment"
                    subtitle="Pay using your UPI ID"
                    isSelected={paymentMethod === 'upi'}
                    onClick={() => setPaymentMethod('upi')}
                  />
                  <PaymentMethodCard
                    icon="💳"
                    title="Digital Wallet"
                    subtitle="Pay using digital wallet"
                    isSelected={paymentMethod === 'wallet'}
                    onClick={() => setPaymentMethod('wallet')}
                  />
                </div>

                {/* UPI Form */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Wallet Form */}
                {paymentMethod === 'wallet' && (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">💳</div>
                      <p className="text-gray-400">
                        You will be redirected to your wallet provider
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-green-500/25"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    `Pay ₹${amount}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with ProfileCompletionGuard
const PremiumPaymentPageWithGuard: React.FC = () => (
  <ProfileCompletionGuard action="payment">
    <PremiumPaymentPage />
  </ProfileCompletionGuard>
);

export default PremiumPaymentPageWithGuard;
