import { useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockCategories, Category } from '@/data/mockData';
import { Plus, MoreVertical, Edit, Trash2, FolderTree } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const { toast } = useToast();

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategory(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    const slug = generateSlug(formData.name);

    // Check for duplicate
    const isDuplicate = categories.some(
      (cat) => cat.slug === slug && cat.id !== editingCategory?.id
    );

    if (isDuplicate) {
      toast({
        variant: 'destructive',
        title: 'Duplicate category',
        description: 'A category with this name already exists.',
      });
      return;
    }

    const categoryData: Category = {
      id: editingCategory?.id || `c${Date.now()}`,
      name: formData.name,
      slug,
      productCount: editingCategory?.productCount || 0,
      createdAt: editingCategory?.createdAt || new Date().toISOString(),
    };

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? categoryData : c))
      );
      toast({ title: 'Category updated', description: 'The category has been updated.' });
    } else {
      setCategories((prev) => [categoryData, ...prev]);
      toast({ title: 'Category created', description: 'The category has been created.' });
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    toast({ title: 'Category deleted', description: 'The category has been removed.' });
  };

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Category',
      render: (category) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderTree className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{category.name}</p>
            <p className="text-sm text-muted-foreground">/{category.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'productCount',
      header: 'Products',
      render: (category) => (
        <span className="font-medium text-foreground">{category.productCount}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (category) => (
        <span className="text-muted-foreground">
          {new Date(category.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (category) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenEdit(category)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(category.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your products into categories"
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        }
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(category) => category.id}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category name below'
                : 'Enter a name for the new category'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter category name"
              />
              {formData.name && (
                <p className="text-sm text-muted-foreground">
                  Slug: /{generateSlug(formData.name)}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
