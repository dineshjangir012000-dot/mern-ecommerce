import { Product } from '@/context/CartContext';

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 2999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.5,
    reviews: 234,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life."
  },
  {
    id: 2,
    name: "Classic Leather Watch",
    price: 1499,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.8,
    reviews: 567,
    description: "Elegant leather watch with Japanese movement and water resistance."
  },
  {
    id: 3,
    name: "Running Sneakers Pro",
    price: 3499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Footwear",
    rating: 4.6,
    reviews: 890,
    description: "Lightweight running shoes with advanced cushioning technology."
  },
  {
    id: 4,
    name: "Designer Sunglasses",
    price: 999,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    category: "Accessories",
    rating: 4.3,
    reviews: 156,
    description: "UV protected designer sunglasses with polarized lenses."
  },
  {
    id: 5,
    name: "Smart Fitness Band",
    price: 1999,
    originalPrice: 2999,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.4,
    reviews: 432,
    description: "Track your fitness goals with heart rate monitoring and sleep tracking."
  },
  {
    id: 6,
    name: "Premium Backpack",
    price: 1299,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Bags",
    rating: 4.7,
    reviews: 321,
    description: "Durable backpack with laptop compartment and water-resistant fabric."
  },
  {
    id: 7,
    name: "Wireless Earbuds",
    price: 1499,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.5,
    reviews: 678,
    description: "True wireless earbuds with crystal clear sound and 24-hour battery."
  },
  {
    id: 8,
    name: "Cotton Casual T-Shirt",
    price: 599,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Clothing",
    rating: 4.2,
    reviews: 234,
    description: "Comfortable 100% cotton t-shirt perfect for everyday wear."
  },
];

export const categories = [
  { name: "Electronics", icon: "📱", count: 45 },
  { name: "Clothing", icon: "👕", count: 120 },
  { name: "Footwear", icon: "👟", count: 67 },
  { name: "Accessories", icon: "⌚", count: 89 },
  { name: "Bags", icon: "🎒", count: 34 },
  { name: "Beauty", icon: "💄", count: 56 },
];
