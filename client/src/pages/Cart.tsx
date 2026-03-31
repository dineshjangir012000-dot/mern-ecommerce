import { Link , useNavigate} from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useCart } from '@/context/CartContext';
// import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/apiHelper';

const Cart = () => {
  // const { clearCart } = useCart();
  // const { isAuthenticated } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [cart, setCart] = useState([])
  const [loading , setLoading ] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)

  const token = localStorage.getItem("token")
  // console.log("Token", token);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const finalTotal = totalPrice + shipping;

  const navigate = useNavigate();

 const handleCheckout = async () => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      items: cart.map((item: any) => ({
        product: item.productId._id,
        quantity: item.quantity,
        name : item.productId.name,
        price : item.productId.price,
      }))
    };

    const orderRes = await axios.post(`${API_BASE_URL}/api/order/createOrder`, payload, {headers : {Authorization : `Bearer ${token}`}})
    console.log("order response ", orderRes)

    const orderId = orderRes.data.data._id;

    const paymentRes = await axios.post(
      `${API_BASE_URL}/api/payment/create-intent`,
      {orderId},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("payment response ", paymentRes);

    navigate("/checkout", {
      state: {
        clientSecret: paymentRes.data.clientSecret,
        publishableKey: paymentRes.data.publishableKey,
        orderId 
      },
    });
  } catch (error) {
    toast.error("Unable to proceed to check out ");
    console.log(error.message)
  }
};


  useEffect(() => {
    const total = cart.reduce((prev, item) => {
      const price = Number(item.productId?.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return prev + price * quantity ;
    }, 0)
    setTotalPrice(total);
  }, [cart])


  const fetchCart = async () => {
    try {
    // setLoading(true)

    const res = await axios.get(`${API_BASE_URL}/api/cart/getCart`, {
      headers : {
        Authorization : `Bearer ${token}`
      }
    })
    console.log("response", res.data)

    if(res.data.status){
      toast.success(res.data.message || "Got all products in carts not")
      setCart(res.data.data.items || []);

    }

    } catch (error) {
      console.log("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  console.log("cart", cart);

  useEffect (() => {
    fetchCart()
  }, [])

   const handleUpdateQuantity = async (productId : any, quantity : any) => {
    if(quantity < 1 ) return ;
    try {
      const res = await axios.put(`${API_BASE_URL}/api/cart/updateQuantity`, {productId , quantity} , {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      toast.success("Quantity updated ")

      fetchCart();

    } catch (error) {
      console.log("Something went wrong in update quantity", error);
    } finally {
      setLoading(false);
    }
  }

  const handleRemove = async (productId : any) => {

    try {
      const res = await axios.delete(`${API_BASE_URL}/api/cart/removeFromCart/${productId}` , {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      console.log("response ", res);
      toast.success("item removed from the cart");
      fetchCart();
      } catch (error) {
      console.log("Error in handle remove", error.message)
    } finally {
      setLoading(false);
    }
  }
   if (cart.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/products">
            <Button variant="hero" size="lg">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-card rounded-xl p-4 shadow-card flex gap-4"
              >
                <Link to={`/product/${item.productId_id}`} className="flex-shrink-0">
                  <img
                    src={item.productId.image || "https://plus.unsplash.com/premium_photo-1689245691650-1e11e2f83ecf?q=80&w=726&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={"Image"}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                      {item.productId.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">{item.productId.category}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-foreground">
                        ₹{(item.productId.price * item.quantity).toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          handleRemove(item.productId._id);
                          // toast.success('Item removed from cart');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-primary font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Add ₹{(999 - totalPrice).toLocaleString()} more for free shipping
                  </p>
                )}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="hero"
                size="xl"
                className="w-full mb-4"
                onClick={handleCheckout}
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Button>

              {!isAuthenticated && (
                <Link to="/auth" className="block">
                  <Button variant="outline" className="w-full">
                    Login / Signup
                  </Button>
                </Link>
              )}

              <Link to="/products" className="block mt-4">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
