import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ForgetPassword from "./pages/ForgetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import CheckoutWrapper from "./pages/CheckOutWrapper";
import GetMyOrder from "./pages/GetMyOrder";
import GetMyOrders from "./pages/GetMyOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/forget-Password" element={<ForgetPassword />}/>
                <Route
                  path="*"
                  element={
                    <>
                      <Navbar />
                      <div className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element = {<CheckoutWrapper />} />
                          <Route path="/payment-success/" element={<PaymentSuccess />}/> 
                          <Route path="/my-order/:orderId" element={<GetMyOrder />}/> 
                          <Route path="/my-orders" element={<GetMyOrders />}/>
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
