export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'freelancer' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: RegisterData) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'freelancer';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Service {
  id: string;
  freelancerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  imageUrl?: string;
  images: string[];
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'processing' | 'refunded';

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';

export interface Order {
  id: string;
  serviceId: string;
  clientId: string;
  freelancerId: string;
  status: OrderStatus;
  requirements: string;
  deliveryDate: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  client?: User;
  freelancer?: User;
}

export interface OrderAnalytics {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  disputedOrders: number;
  ordersByStatus: Array<{
    status: OrderStatus;
    count: number;
  }>;
}

export interface Payment {
  id: string;
  orderId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId?: string;
  paymentDetails?: any;
  createdAt: string;
  updatedAt: string;
  order?: any;
  payer?: User;
  receiver?: User;
}

export interface EarningsSummary {
  totalEarnings: number;
  pendingPayments: number;
  completedPayments: number;
  monthlyEarnings: Array<{
    month: string;
    amount: number;
  }>;
}