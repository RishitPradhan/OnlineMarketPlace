import { Payment, PaymentStatus } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
            <Skeleton className="h-12 w-full" />
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-mono">
              {payment.transactionId || payment.id.slice(0, 8)}
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
            </TableCell>
            <TableCell className="font-medium">
              {formatAmount(payment.amount)}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                {payment.payer?.avatar && (
                  <img
                    src={payment.payer.avatar}
                    alt={`${payment.payer.firstName} ${payment.payer.lastName}`}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span>
                  {payment.payer
                    ? `${payment.payer.firstName} ${payment.payer.lastName}`
                    : 'Unknown'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                {payment.receiver?.avatar && (
                  <img
                    src={payment.receiver.avatar}
                    alt={`${payment.receiver.firstName} ${payment.receiver.lastName}`}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span>
                  {payment.receiver
                    ? `${payment.receiver.firstName} ${payment.receiver.lastName}`
                    : 'Unknown'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={getStatusColor(payment.status)}
              >
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="capitalize">
              {payment.paymentMethod}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}