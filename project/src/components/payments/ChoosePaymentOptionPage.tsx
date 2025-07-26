import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const paymentOptions = [
  { label: 'Debit / Credit card', icon: '💳', value: 'card' },
  { label: 'UPI', icon: '🔗', value: 'upi' },
];

const ChoosePaymentOptionPage: React.FC<{ onSelect: (value: string) => void }> = ({ onSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get payment details from location state
  const paymentDetails = location.state || {};
  
  console.log('ChoosePaymentOptionPage received payment details:', paymentDetails);

  const handleSelect = (value: string) => {
    console.log('Navigating to payment with details:', paymentDetails);
    if (value === 'card') {
      navigate('/payment/card', { state: paymentDetails });
    } else if (value === 'upi') {
      navigate('/payment/upi', { state: paymentDetails });
    } else {
      onSelect(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-[350px] rounded-3xl bg-gray-800 shadow-2xl p-8">
        <button className="mb-6 text-gray-400 hover:text-green-500 text-xl" onClick={() => navigate(-1)}>←</button>
        <h2 className="text-2xl font-bold mb-8 text-white">Choose Payment option</h2>
        <div className="space-y-4">
          {paymentOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-700 hover:border-green-500 bg-gray-900 text-gray-100 font-medium text-lg transition-all"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                {opt.label}
              </span>
              <span className="text-gray-500">›</span>
            </button>
          ))}
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-gray-600 text-gray-400 font-medium text-lg mt-2">
            + Add another option
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePaymentOptionPage; 