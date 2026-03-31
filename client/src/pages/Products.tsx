import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
// import { categories } from '@/data/products';
import axios from 'axios';
import { toast } from 'sonner';
import { getImageUrl } from '@/config/apiHelper';


const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)

  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 9;

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/category/getAllCategories")

      console.log("response of category", res)

      if(res.data.status){
        setCategories(res.data.data);
      }
    } catch (error) {
      console.log("Something went wrong", error)
    } finally{
      setCategoryLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [])

  const fetchproducts = async () => {
   
    try {
      setLoading(true)

      const params : any = {
        page : currentPage,
        limit : LIMIT
      } ;

      if(searchQuery) params.search = searchQuery

      if(selectedCategory) params.category = selectedCategory

      if(sortBy === 'price-low'){
        params.sort = "price";
        params.order = "asc";
      }
      if(sortBy === 'price-high'){
        params.sort = "price";
        params.order = "desc";
      }
      if(sortBy === 'newest'){
        params.sort = "newest";
      }
      if(sortBy === 'rating'){
        params.sort = "rating";
      }

      console.log("params", params);

      const res = await axios.get('http://localhost:3000/api/product/getAllProducts', {params})
    console.log("response ", res.data)

    if(res.data.status){
      // toast.success(res.data.message || "all products mil gye")
      setProducts(res.data.data);
      setTotalPages(res.data.pagination.totalPages); 
    }
    } catch (error) {
      console.log("Something went wrong ")
    } finally{
      setLoading(false)
    }
  };
  // console.log("products", Products)
  console.log("product", products)

  useEffect(() => {
    setCurrentPage(1)
  }, [setCategories, searchQuery, sortBy]);

  useEffect(() => {
    fetchproducts();
  }, [searchQuery, selectedCategory, sortBy, currentPage])

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {
              categories.find(cat => cat._id === selectedCategory)?.name || "All product's"
            }
          </h1>
          <p className="text-muted-foreground">
            {products.length} products found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Filters</h3>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between ${
                        selectedCategory === cat._id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      <span>{cat.icon} {cat.name}</span>
                      <span className="opacity-60">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Best Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {products.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}

                          {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-10">
    
    {/* Previous */}
    <Button
      variant="outline"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
    >
      Prev
    </Button>

    {/* Page Numbers */}
    {[...Array(totalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Button>
      );
    })}

    {/* Next */}
    <Button
      variant="outline"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(prev => prev + 1)}
    >
      Next
    </Button>
  </div>
)}

          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;

