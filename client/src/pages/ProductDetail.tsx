import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import axios from 'axios';
import { getImageUrl } from '@/config/apiHelper';

const ProductDetail = () => {
  const { id } = useParams();
  // const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const [addToCart, setAddToCart] = useState([])
    // const [loading , setLoading] = useState(true)

  const token = localStorage.getItem("token")


  const filterProduct = async () => {
    // console.log("id", id)
    try {

      const res = await axios.get(`http://localhost:3000/api/product/getProductById/${id}`)
      console.log("response ", res.data.data)

      if(res.data.status) {
        toast.success(res.data.message || "we got the product with this particular id")
        setProduct(res.data.data);
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }
  console.log("product", product);

  useEffect(() => {
    filterProduct();
  }, [id])

  // const product = products.find(p => p.id === Number(id));
  // const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading product...
    </div>
  );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    try {

      const payload = { productId : product._id };

      const res = await axios.post("http://localhost:3000/api/cart/addToCart" , payload , {
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      if(res.data.status){
        toast.success(res.data.message || "Product added !!! ")
        setAddToCart(res.data.data.items);

        window.dispatchEvent(new Event ("cart-updated"))
      }
    } catch (error) {
      console.log("Something went wrong in add to cart on product details page")
    } finally{
      setLoading(false);
    }
    // for (let i = 0; i < quantity; i++) {
    //   addToCart(product);
    // }
    // toast.success(`${quantity} × ${product.name} added to cart!`);
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src={ getImageUrl(product.images?.[0]) || "https://plus.unsplash.com/premium_photo-1661597156656-75ba116e9e1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVjdHN8ZW58MHx8MHx8fDA%3D"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {discount > 0 && (
              <div className="absolute top-4 left-4 gradient-accent text-accent-foreground font-bold px-4 py-2 rounded-full">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-primary font-medium uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>


            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted'}`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-foreground">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-primary font-medium">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-foreground">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setQuantity(Math.max(1, quantity - 1))
                    filterProduct();
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button variant="hero" size="xl" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => {
                  setIsLiked(!isLiked);
                  toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist');
                }}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-secondary rounded-xl">
              {[
                { icon: Truck, title: "Free Shipping", desc: "On orders ₹999+" },
                { icon: Shield, title: "Secure", desc: "100% protected" },
                { icon: RotateCcw, title: "Easy Returns", desc: "30 days" },
              ].map((feature, idx) => (
                <div key={idx} className="text-center">
                  <feature.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {/* {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )} */}
      </div>
    </main>
  );
};

export default ProductDetail;
