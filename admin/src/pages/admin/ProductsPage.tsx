import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Search,
  Plus,
  Package,
} from "lucide-react";

import { toast } from "sonner";
import axios from "axios";
import { API_BASE_URL } from "../apihelper";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const admintoken = localStorage.getItem("admintoken");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountedPrice: "",
    category: "",
    stock: "",
    description: "",
    isactive: true,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/products/getAllProductsAdmin`,
        {
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );
      console.log("response: ", res);

      if (res.data.status) {
        setProducts(res.data.data);
        toast.success(res.data.message || "Products fetch successfully");
      }
    } catch (error) {
      toast.error("Error in fetching products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cateRes = await axios.get(
        `${API_BASE_URL}/api/admin/categories/getAllCategoriesAdmin`,
        {
          headers: { Authorization: `Bearer ${admintoken}` },
        }
      );
      console.log("categories response :", cateRes);

      if (cateRes.data.status) {
        setCategories(cateRes.data.data);
        toast.success(
          cateRes.data.message || "fetch the catedories successfully"
        );
      }
    } catch (error) {
      toast.error("failed to fetch the categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admintoken) return;
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) =>
    product?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      discountedPrice: "",
      category: "",
      stock: "",
      description: "",
      isactive: true,
    });
    setEditingProduct(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      discountedPrice: product.discountedPrice?.toString() || "",
      category: product.category?._id,
      stock: product.stock.toString(),
      description: "",
      isactive: product.isactive,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        price: formData.price,
        discountedPrice: formData.discountedPrice
          ? Number(formData.discountedPrice)
          : undefined,
        category: formData.category,
        stock: formData.stock,
        description: formData.description,
        isactive: formData.isactive,
      };

      console.log("payload", payload);

      if (editingProduct) {
        const updateRes = await axios.put(
          `${API_BASE_URL}/api/admin/products/updateProductAdmin/${editingProduct._id}`,
          payload,
          { headers: { Authorization: `Bearer ${admintoken}` } }
        );
        console.log("update response :", updateRes);
        toast.success(updateRes.data.message || "Product updated successfully");
      } else {
        const createRes = await axios.post(
          `${API_BASE_URL}/api/admin/products/createProductAdmin`,
          payload,
          {headers : {Authorization: `Bearer ${admintoken}`}}
        );

        console.log("create response:", createRes);
        toast.success(createRes.data.message || "Product created successfully");
      }
      setIsFormOpen(false);
      resetForm();

      fetchProducts();
    } catch (error) {
      toast.error("failed to update the product");
    }
  };

  const handleDelete = async (productId: any) => {
    console.log("product id:", productId);
    try {
      const deleteRes = await axios.delete(
        `${API_BASE_URL}/api/admin/products/deleteProductAdmin/${productId}`,
        { headers: { Authorization: `Bearer ${admintoken}` } }
      );
      console.log("Delete response:", deleteRes);
      toast.success(
        deleteRes.data.message || "delete the product successfully by admin"
      );
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete the product");
    }
  };

  const handleViewDetails = async (productId) => {
    try {
      const viewRes = await axios.get(`${API_BASE_URL}/api/admin/products/getProductByIdAdmin/${productId}`, 
        {headers : {Authorization: `Bearer ${admintoken}`}}
      )
    } catch (error) {
      toast.error("failed to fetch the product details")
    }
  }

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {product.category?.name || "No category"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (product) => (
        <div>
          {product.discountedPrice ? (
            <>
              <p className="font-medium text-foreground">
                ${product.discountedPrice.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="font-medium text-foreground">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "isactive",
      header: "Status",
      render: (product) => (
        <span className={product.isactive ? "text-green-500" : "text-red-500"}>
          {product.isactive ? "Active" : "InActive"}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => (
        <div>
          <p className="font-medium text-foreground">{product.stock}</p>
          <StatusBadge
            status={product.stock > 0 ? "In Stock" : "Out of stock"}
          />
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (product) => (
        <span className="text-muted-foreground">
          {new Date(product.createdAt).toLocaleDateString()},
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (product: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEdit(product)}
            className="px-3 py-1 text-xs rounded bg-blue-500 text-white"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(product._id)}
            className="px-3 py-1 text-xs rounded bg-red-500 text-white"
          >
            Delete
          </button>
          <button
            onClick={() => handleViewDetails(product._id)}
            className="px-3 py-1 text-xs rounded bg-gray-600 text-white"
          >
            View details
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(product) => product._id}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update the product information below"
                : "Fill in the product details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price ($)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountedPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountedPrice: e.target.value,
                    })
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.isactive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      isactive: value === "active",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
