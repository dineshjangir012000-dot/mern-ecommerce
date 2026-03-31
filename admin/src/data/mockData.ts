// Mock data for the admin panel - replace with API calls to your Express backend

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'active' | 'blocked';
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  category: string;
  stock: number;
  inStock: boolean;
  images: string[];
  createdAt: string;
  sold: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  shippingAddress: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  userGrowth: string;
  orderGrowth: string;
  revenueGrowth: string;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

// Mock Users
export const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'USER', status: 'active', createdAt: '2024-01-15', ordersCount: 12, totalSpent: 1250 },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'USER', status: 'active', createdAt: '2024-02-20', ordersCount: 5, totalSpent: 430 },
  { id: 'u3', name: 'Carol Williams', email: 'carol@example.com', role: 'USER', status: 'blocked', createdAt: '2024-01-10', ordersCount: 2, totalSpent: 150 },
  { id: 'u4', name: 'David Brown', email: 'david@example.com', role: 'USER', status: 'active', createdAt: '2024-03-05', ordersCount: 8, totalSpent: 890 },
  { id: 'u5', name: 'Eva Martinez', email: 'eva@example.com', role: 'USER', status: 'active', createdAt: '2024-02-28', ordersCount: 15, totalSpent: 2100 },
  { id: 'u6', name: 'Frank Garcia', email: 'frank@example.com', role: 'USER', status: 'active', createdAt: '2024-03-12', ordersCount: 3, totalSpent: 275 },
  { id: 'u7', name: 'Grace Lee', email: 'grace@example.com', role: 'USER', status: 'active', createdAt: '2024-01-25', ordersCount: 20, totalSpent: 3500 },
  { id: 'u8', name: 'Henry Wilson', email: 'henry@example.com', role: 'USER', status: 'blocked', createdAt: '2024-02-14', ordersCount: 1, totalSpent: 50 },
];

// Mock Products
export const mockProducts: Product[] = [
  { id: 'p1', name: 'Wireless Headphones Pro', price: 199.99, discountedPrice: 149.99, category: 'Electronics', stock: 50, inStock: true, images: ['/placeholder.svg'], createdAt: '2024-01-10', sold: 234 },
  { id: 'p2', name: 'Smart Watch Series X', price: 399.99, category: 'Electronics', stock: 30, inStock: true, images: ['/placeholder.svg'], createdAt: '2024-01-15', sold: 156 },
  { id: 'p3', name: 'Premium Leather Wallet', price: 79.99, discountedPrice: 59.99, category: 'Accessories', stock: 100, inStock: true, images: ['/placeholder.svg'], createdAt: '2024-02-01', sold: 89 },
  { id: 'p4', name: 'Running Shoes Ultra', price: 129.99, category: 'Footwear', stock: 0, inStock: false, images: ['/placeholder.svg'], createdAt: '2024-02-10', sold: 312 },
  { id: 'p5', name: 'Organic Cotton T-Shirt', price: 34.99, category: 'Clothing', stock: 200, inStock: true, images: ['/placeholder.svg'], createdAt: '2024-02-20', sold: 567 },
  { id: 'p6', name: 'Portable Bluetooth Speaker', price: 89.99, discountedPrice: 69.99, category: 'Electronics', stock: 75, inStock: true, images: ['/placeholder.svg'], createdAt: '2024-03-01', sold: 198 },
];

// Mock Orders
export const mockOrders: Order[] = [
  { id: 'o1', userId: 'u1', userName: 'Alice Johnson', userEmail: 'alice@example.com', items: [{ productId: 'p1', productName: 'Wireless Headphones Pro', quantity: 1, price: 149.99 }], total: 149.99, status: 'DELIVERED', paymentStatus: 'paid', createdAt: '2024-03-15T10:30:00Z', shippingAddress: '123 Main St, New York, NY 10001' },
  { id: 'o2', userId: 'u5', userName: 'Eva Martinez', userEmail: 'eva@example.com', items: [{ productId: 'p2', productName: 'Smart Watch Series X', quantity: 1, price: 399.99 }, { productId: 'p3', productName: 'Premium Leather Wallet', quantity: 2, price: 119.98 }], total: 519.97, status: 'SHIPPED', paymentStatus: 'paid', createdAt: '2024-03-14T14:20:00Z', shippingAddress: '456 Oak Ave, Los Angeles, CA 90001' },
  { id: 'o3', userId: 'u7', userName: 'Grace Lee', userEmail: 'grace@example.com', items: [{ productId: 'p5', productName: 'Organic Cotton T-Shirt', quantity: 3, price: 104.97 }], total: 104.97, status: 'PAID', paymentStatus: 'paid', createdAt: '2024-03-16T09:15:00Z', shippingAddress: '789 Pine Rd, Chicago, IL 60601' },
  { id: 'o4', userId: 'u2', userName: 'Bob Smith', userEmail: 'bob@example.com', items: [{ productId: 'p6', productName: 'Portable Bluetooth Speaker', quantity: 1, price: 69.99 }], total: 69.99, status: 'PENDING', paymentStatus: 'pending', createdAt: '2024-03-16T16:45:00Z', shippingAddress: '321 Elm St, Houston, TX 77001' },
  { id: 'o5', userId: 'u4', userName: 'David Brown', userEmail: 'david@example.com', items: [{ productId: 'p1', productName: 'Wireless Headphones Pro', quantity: 2, price: 299.98 }], total: 299.98, status: 'DELIVERED', paymentStatus: 'paid', createdAt: '2024-03-10T11:00:00Z', shippingAddress: '654 Maple Dr, Phoenix, AZ 85001' },
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: 'c1', name: 'Electronics', slug: 'electronics', productCount: 45, createdAt: '2024-01-01' },
  { id: 'c2', name: 'Clothing', slug: 'clothing', productCount: 120, createdAt: '2024-01-01' },
  { id: 'c3', name: 'Footwear', slug: 'footwear', productCount: 35, createdAt: '2024-01-05' },
  { id: 'c4', name: 'Accessories', slug: 'accessories', productCount: 80, createdAt: '2024-01-10' },
  { id: 'c5', name: 'Home & Garden', slug: 'home-garden', productCount: 65, createdAt: '2024-02-01' },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalUsers: 1247,
  totalOrders: 3892,
  totalRevenue: 284750,
  totalProducts: 345,
  userGrowth: '+12.5% from last month',
  orderGrowth: '+8.2% from last month',
  revenueGrowth: '+15.3% from last month',
};

// Sales data for charts
export const mockSalesData: SalesData[] = [
  { date: 'Jan', sales: 18500, orders: 245 },
  { date: 'Feb', sales: 22300, orders: 298 },
  { date: 'Mar', sales: 19800, orders: 267 },
  { date: 'Apr', sales: 25600, orders: 342 },
  { date: 'May', sales: 28900, orders: 389 },
  { date: 'Jun', sales: 31200, orders: 412 },
  { date: 'Jul', sales: 29500, orders: 395 },
];

// Best selling products
export const mockBestSellers = mockProducts
  .sort((a, b) => b.sold - a.sold)
  .slice(0, 5);
