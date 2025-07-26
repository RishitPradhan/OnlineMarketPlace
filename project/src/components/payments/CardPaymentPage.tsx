import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderManagement } from '../../lib/order-management';
import { useAuth } from '../../contexts/AuthContext';

const CardPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tab, setTab] = useState<'debit' | 'credit'>('debit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get payment details from location state
  const paymentDetails = location.state || {};
  const amount = paymentDetails.amount || 100;
  const serviceId = paymentDetails.serviceId;
  const freelancerId = paymentDetails.freelancerId;
  const serviceTitle = paymentDetails.serviceTitle || 'Service';
  const packageName = paymentDetails.packageName || 'Package';
  const freelancerName = paymentDetails.freelancerName || 'Freelancer';

  console.log('CardPaymentPage received payment details:', paymentDetails);
  console.log('Parsed details:', { amount, serviceId, freelancerId, serviceTitle, packageName, freelancerName });
  console.log('Freelancer name from payment details:', paymentDetails.freelancerName);

  // Card brand detection (simple)
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

    // Basic validation
    if (!cardNumber.replace(/\s/g, '') || !expiry.replace(/\s|\//g, '') || !cvv || !name) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Create payment intent
      const response = await fetch('http://localhost:3001/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(amount),
          paymentMethod: 'card',
          orderId: `order_${Date.now()}`,
          payerId: user?.id || 'user_123',
          receiverId: freelancerId || 'freelancer_456',
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Payment failed');
      }

      // Create order in database
      if (user?.id && serviceId && freelancerId) {
        const orderData = {
          serviceId: serviceId,
          clientId: user.id,
          freelancerId: freelancerId,
          amount: Number(amount),
          requirements: `Package: ${packageName}`,
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        };
        
        console.log('Creating order with data:', orderData);
        
        const orderResult = await orderManagement.createOrder(orderData);

        if (!orderResult.success) {
          console.error('Failed to create order:', orderResult.error);
        } else {
          console.log('Order created successfully:', orderResult.data);
          // Notify freelancer about new order
          try {
            await fetch('http://localhost:3001/api/notify-freelancer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                freelancerId: freelancerId,
                orderId: orderResult.data?.id || `order_${Date.now()}`,
                serviceTitle: serviceTitle,
                amount: amount,
                clientName: user.email || 'Client'
              }),
            });
          } catch (notifyError) {
            console.error('Failed to notify freelancer:', notifyError);
          }
        }
      }

      // Simulate successful payment
      setTimeout(() => {
        navigate('/payments/success', { 
          state: { 
            amount: amount,
            paymentMethod: 'card',
            transactionId: `txn_${Date.now()}`,
            serviceTitle: serviceTitle,
            freelancerName: freelancerName,
            packageName: packageName
          }
        });
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-[350px] rounded-3xl bg-gray-800 shadow-2xl p-8">
        <button className="mb-6 text-gray-400 hover:text-green-500 text-xl" onClick={() => navigate(-1)}>←</button>
        
        {/* Payment Summary */}
        <div className="mb-6 p-4 bg-gray-700 rounded-xl">
          <h3 className="text-white font-semibold mb-2">Payment Summary</h3>
          <div className="text-gray-300 text-sm space-y-1">
            <div>Service: {serviceTitle}</div>
            <div>Package: {packageName}</div>
            <div>Freelancer: {freelancerName}</div>
            <div className="text-green-400 font-bold text-lg">Amount: ₹{amount}</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-white">Debit / Credit Card</h2>
        <div className="flex mb-6 border-b border-gray-700">
          <button
            className={`flex-1 pb-2 text-lg font-medium ${tab === 'debit' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setTab('debit')}
          >
            Debit Card
          </button>
          <button
            className={`flex-1 pb-2 text-lg font-medium ${tab === 'credit' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setTab('credit')}
          >
            Credit Card
          </button>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="block text-gray-400 text-xs mb-1">Card Number</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-700 px-4 py-3 pr-12 text-lg font-mono tracking-widest focus:outline-none focus:border-green-500 bg-gray-900 text-white placeholder-gray-500"
              placeholder="5534 2534 8857 5370"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
            {cardBrand === 'visa' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-12" />
            )}
            {cardBrand === 'mastercard' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-12" />
            )}
            {cardBrand === 'amex' && (
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" alt="Amex" className="absolute top-1/2 right-3 transform -translate-y-1/2 h-6 w-12" />
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-400 text-xs mb-1">Expiry date</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-700 px-4 py-3 text-lg font-mono focus:outline-none focus:border-green-500 bg-gray-900 text-white placeholder-gray-500"
                placeholder="MM / YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                maxLength={7}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 text-xs mb-1">CVV</label>
              <input
                type="password"
                className="w-full rounded-xl border border-gray-700 px-4 py-3 text-lg font-mono focus:outline-none focus:border-green-500 bg-gray-900 text-white placeholder-gray-500"
                placeholder="CVV"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={4}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Name</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-700 px-4 py-3 text-lg focus:outline-none focus:border-green-500 bg-gray-900 text-white placeholder-gray-500"
              placeholder="ADDISON NELSON"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveCard"
              checked={saveCard}
              onChange={e => setSaveCard(e.target.checked)}
              className="accent-green-600 rounded"
            />
            <label htmlFor="saveCard" className="text-gray-400 text-sm">Save card for future checkout</label>
          </div>
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-medium bg-gray-800 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : `Pay ₹${amount}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardPaymentPage; 