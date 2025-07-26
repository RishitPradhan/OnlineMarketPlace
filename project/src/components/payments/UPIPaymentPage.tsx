import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderManagement } from '../../lib/order-management';
import { useAuth } from '../../contexts/AuthContext';

// UPI icon component
const UPIIcon: React.FC = () => (
  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-2">
    <div className="text-blue-600 font-bold text-lg">UPI</div>
  </div>
);

const UPIPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [upiId, setUpiId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get payment details from location state
  const paymentDetails = location.state || {};
  const amount = paymentDetails.amount || 100;
  const serviceId = paymentDetails.serviceId;
  const freelancerId = paymentDetails.freelancerId;
  const serviceTitle = paymentDetails.serviceTitle || 'Service';
  const packageName = paymentDetails.packageName || 'Package';
  const freelancerName = paymentDetails.freelancerName || 'Freelancer';

  console.log('UPIPaymentPage received payment details:', paymentDetails);
  console.log('Parsed details:', { amount, serviceId, freelancerId, serviceTitle, packageName, freelancerName });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic UPI ID validation
    if (!upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., yourname@upi)');
      return;
    }
    
    setLoading(true);
    setStatus('');
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/create-upi-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upiId, amount }),
      });
      const data = await response.json();
      
      if (data.status === 'succeeded') {
        setStatus('Payment successful!');
        
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
          console.log('Order creation result:', orderResult);

          if (!orderResult.success) {
            console.error('Failed to create order:', orderResult.error);
            setError('Payment successful but failed to create order. Please contact support.');
          } else {
            console.log('Order created successfully:', orderResult.data);
            setStatus('Payment successful! Order created.');
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

        setTimeout(() => navigate('/payments/success', { 
          state: { 
            amount: amount,
            paymentMethod: 'upi',
            transactionId: data.transactionId || `txn_${Date.now()}`,
            serviceTitle: serviceTitle,
            freelancerName: freelancerName,
            packageName: packageName
          }
        }), 1500);
      } else {
        setError(data.message || 'Payment failed or cancelled.');
      }
          } catch (err) {
        console.error('UPI payment error:', err);
        if (err instanceof Error) {
          setError(`Error: ${err.message}`);
        } else {
          setError('Error initiating UPI payment. Please try again.');
        }
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

        <div className="flex flex-col items-center mb-6">
          <UPIIcon />
          <h2 className="text-2xl font-bold text-white">Pay with UPI</h2>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-400 text-xs mb-1">UPI ID</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-700 px-4 py-3 text-lg focus:outline-none focus:border-green-500 bg-gray-900 text-white placeholder-gray-500"
              placeholder="yourname@upi"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              required
            />
          </div>
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
        {status && <div className="mt-4 text-green-400 text-center">{status}</div>}
        {error && <div className="mt-4 text-red-400 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default UPIPaymentPage; 