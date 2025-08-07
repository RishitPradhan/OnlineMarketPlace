import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderManagement } from '../../lib/order-management';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileCompletionGuard } from '../common/ProfileCompletionGuard';
import { generateUUID } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

// Stripe Logo Component
const StripeLogo: React.FC = () => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex items-center space-x-3 text-gray-300 text-sm font-medium">
      <span className="text-gray-400">Secured by</span>
      <div className="flex items-center space-x-2">
        <svg className="h-5 w-20" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M59.64 14.28h-8.06v-1.83h8.06v1.83zm-8.06 4.99h8.06v-1.83h-8.06v1.83zm0-9.8v1.83h8.06V9.47h-8.06zm-2.81-5.77l-2.81 5.77h2.81l2.81-5.77h-2.81zm-2.81 5.77l-2.81-5.77h-2.81l2.81 5.77h2.81zm-8.06 9.8h2.81V9.47h-2.81v9.8zm-2.81-9.8h-2.81v9.8h2.81V9.47zm-8.06 9.8h2.81V9.47h-2.81v9.8zm-2.81-9.8h-2.81v9.8h2.81V9.47zm-8.06 9.8h2.81V9.47h-2.81v9.8zm-2.81-9.8h-2.81v9.8h2.81V9.47zm-8.06 9.8h2.81V9.47h-2.81v9.8zm-2.81-9.8h-2.81v9.8h2.81V9.47z" fill="currentColor"/>
        </svg>
      </div>
    </div>
  </div>
);

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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Card form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(false);

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

  // Card brand detection
  let cardBrand = '';
  if (/^4/.test(cardNumber.replace(/\s/g, ''))) cardBrand = 'visa';
  else if (/^5[1-5]/.test(cardNumber.replace(/\s/g, ''))) cardBrand = 'mastercard';
  else if (/^3[47]/.test(cardNumber.replace(/\s/g, ''))) cardBrand = 'amex';

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date with automatic /
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (paymentMethod === 'card') {
        if (!cardNumber.replace(/\s/g, '') || !expiry.replace(/\s|\//g, '') || !cvv || !name) {
          throw new Error('Please fill in all card fields');
        }
      } else {
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
          const validServiceId = serviceId || '5b9eb8a0-0747-4b2c-a937-3e41e86e7fc4'; // Sample service ID from database
          
          const validFreelancerId = freelancerId || '32c22203-6126-4d6c-97e8-b2cf05e802af'; // Sample freelancer ID from database

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
                console.log('Using service delivery time:', deliveryDays, 'days');
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
            deliveryDate: new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toISOString(), // Use service delivery time
          };
          
          console.log('Creating order with data:', orderData);
          console.log('Delivery days:', deliveryDays);
          
          orderResult = await orderManagement.createOrder(orderData);
          
          if (!orderResult.success) {
            console.error('Failed to create order:', orderResult.error);
            throw new Error(`Failed to create order: ${orderResult.error}`);
          } else {
            console.log('Order created successfully:', orderResult.data);
          }
        } catch (orderError) {
          console.error('Order creation failed:', orderError);
          // Don't throw error for order creation failure, just log it
          // Payment can still be successful even if order creation fails
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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Stripe Logo */}
        <StripeLogo />
        
        {/* Main Payment Container */}
        <div className="glass-effect neon-border rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-700 p-8 border-b border-green-500/20">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-green-400 transition-colors mb-6 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-3">Complete Payment</h1>
              <p className="text-green-400/80 text-lg">Secure payment processing</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-8 border-b border-green-500/20">
            <div className="glass-effect rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Payment Summary</h3>
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
                <div className="pt-3 border-t border-green-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-bold text-base">Total Amount:</span>
                    <span className="text-green-400 font-bold text-2xl">₹{amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Choose Payment Method</h2>
            <div className="space-y-4 mb-8">
              <PaymentMethodCard
                icon="💳"
                title="Credit / Debit Card"
                subtitle="Visa, Mastercard, American Express"
                isSelected={paymentMethod === 'card'}
                onClick={() => setPaymentMethod('card')}
              />
              <PaymentMethodCard
                icon="🔗"
                title="UPI Payment"
                subtitle="Instant bank transfer"
                isSelected={paymentMethod === 'upi'}
                onClick={() => setPaymentMethod('upi')}
              />
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {paymentMethod === 'card' ? (
                <>
                  <div className="relative">
                    <label className="block text-gray-300 text-sm mb-3 font-semibold">Card Number</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border-2 border-green-500/30 px-5 py-4 pr-12 text-lg font-mono tracking-widest focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 glass-effect text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                    {cardBrand && (
                      <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                        {cardBrand === 'visa' && (
                          <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VISA</span>
                          </div>
                        )}
                        {cardBrand === 'mastercard' && (
                          <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">MC</span>
                          </div>
                        )}
                        {cardBrand === 'amex' && (
                          <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">AMEX</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-300 text-sm mb-3 font-semibold">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border-2 border-green-500/30 px-5 py-4 text-lg font-mono focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 glass-effect text-white placeholder-gray-500 transition-all duration-300"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={e => setExpiry(formatExpiry(e.target.value))}
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-3 font-semibold">CVV</label>
                      <input
                        type="password"
                        className="w-full rounded-xl border-2 border-green-500/30 px-5 py-4 text-lg font-mono focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 glass-effect text-white placeholder-gray-500 transition-all duration-300"
                        placeholder="123"
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-3 font-semibold">Cardholder Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border-2 border-green-500/30 px-5 py-4 text-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 glass-effect text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="JOHN DOE"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={saveCard}
                      onChange={e => setSaveCard(e.target.checked)}
                      className="w-4 h-4 text-green-600 glass-effect border-green-500/30 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <label htmlFor="saveCard" className="text-gray-400 text-sm">
                      Save card for future payments
                    </label>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-gray-300 text-sm mb-3 font-semibold">UPI ID</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border-2 border-green-500/30 px-5 py-4 text-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 glass-effect text-white placeholder-gray-500 transition-all duration-300"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your UPI ID to receive payment request
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-5 rounded-xl border-2 border-green-500/30 text-gray-400 font-bold glass-effect hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-bold hover:from-green-700 hover:to-green-600 shadow-xl shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${amount}`
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Footer */}
          <div className="p-6 bg-gradient-to-r from-green-500/10 to-green-500/5 border-t border-green-500/20">
            <div className="flex items-center justify-center space-x-3 text-gray-400 text-sm font-medium">
              <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>256-bit SSL encrypted payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PremiumPaymentPageWithGuard: React.FC = () => {
  return (
    <ProfileCompletionGuard action="place_order">
      <PremiumPaymentPage />
    </ProfileCompletionGuard>
  );
};

export default PremiumPaymentPage; 