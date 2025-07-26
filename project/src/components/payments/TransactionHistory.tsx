import { Payment, PaymentStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface TransactionHistoryProps {
  payments: Payment[];
  getStatusColor: (status: PaymentStatus) => string;
  loading?: boolean;
}

export default function TransactionHistory({
  payments,
  getStatusColor,
  loading = false
}: TransactionHistoryProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions found
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="border rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-sm text-gray-600">
                {payment.transactionId || payment.id.slice(0, 8)}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-lg">
                {formatAmount(payment.amount)}
              </p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              {payment.payer?.avatar && (
                <img
                  src={payment.payer.avatar}
                  alt={`${payment.payer.firstName} ${payment.payer.lastName}`}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>
                From: {payment.payer
                  ? `${payment.payer.firstName} ${payment.payer.lastName}`
                  : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {payment.receiver?.avatar && (
                <img
                  src={payment.receiver.avatar}
                  alt={`${payment.receiver.firstName} ${payment.receiver.lastName}`}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span>
                To: {payment.receiver
                  ? `${payment.receiver.firstName} ${payment.receiver.lastName}`
                  : 'Unknown'}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 capitalize">
            Payment Method: {payment.paymentMethod}
          </div>
        </div>
      ))}
    </div>
  );
}