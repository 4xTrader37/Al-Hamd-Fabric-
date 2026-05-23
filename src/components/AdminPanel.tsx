import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Lock, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Sparkles, 
  Grid, 
  Folder, 
  Sliders,
  Check,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  categories: { id: string; name: string }[];
  collections: { id: string; name: string; desc: string; image: string }[];
  onSaveProducts: (products: Product[]) => void;
  onSaveCategories: (categories: { id: string; name: string }[]) => void;
  onSaveCollections: (collections: { id: string; name: string; desc: string; image: string }[]) => void;
  onBackToShop: () => void;
}

// Image compression utility to ensure uploads comfortably fit within the browser's 5MB localStorage budget
const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 1000): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image/')) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress with jpeg format and 0.72 quality for localStorage compatibility
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

export default function AdminPanel({
  products,
  categories,
  collections,
  onSaveProducts,
  onSaveCategories,
  onSaveCollections,
  onBackToShop
}: AdminPanelProps) {
  // Password screen state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // active tab: 'products' | 'categories-collections' | 'add-product'
  const [activeTab, setActiveTab] = useState<'products' | 'add-product' | 'categories-collections'>('products');

  // Search filter inside products list
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');

  // Add / Edit Product form states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [productCategory, setProductCategory] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [tag, setTag] = useState('');
  const [colors, setColors] = useState('');
  const [inStock, setInStock] = useState(true);

  // File upload processing helpers
  const handleUploadFiles = (files: File[]) => {
    const remainingSlots = 5 - productImages.length;
    if (files.length > remainingSlots) {
      alert(`You can only upload up to ${remainingSlots} more images (Maximum 5).`);
      return;
    }

    const promises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const originalBase64 = reader.result as string;
          try {
            const compressed = await compressImage(originalBase64);
            resolve(compressed);
          } catch (err) {
            console.error('Failed to compress, fallback to original', err);
            resolve(originalBase64);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(compressedStrings => {
      setProductImages(prev => [...prev, ...compressedStrings]);
    });
  };

  const handleUploadSingleFile = (file: File, callback: (src: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const originalBase64 = reader.result as string;
      try {
        const compressed = await compressImage(originalBase64);
        callback(compressed);
      } catch (err) {
        console.error('Failed to compress base64', err);
        callback(originalBase64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Fabric specs
  const [material, setMaterial] = useState('');
  const [pieces, setPieces] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [stitchType, setStitchType] = useState('Unstitched');
  const [season, setSeason] = useState('');

  // Editing/Creating Categories states
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Editing/Creating Collections states
  const [newColId, setNewColId] = useState('');
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColImage, setNewColImage] = useState('');
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColName, setEditingColName] = useState('');
  const [editingColDesc, setEditingColDesc] = useState('');
  const [editingColImage, setEditingColImage] = useState('');

  // Deletion and Restore confirmation state (safe in-app modal instead of browser confirm() which fails in sandboxed iframes)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'product' | 'category' | 'collection' | 'restore';
    id: string;
    title: string;
    message: string;
  } | null>(null);

  // Handle Password Submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'alHamdneweb') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  // Switch to add view or load into edit form
  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice);
    setProductCategory(prod.category);
    setProductImages(prod.images || []);
    setTag(prod.tag || '');
    setColors(prod.colors.join(', '));
    setInStock(prod.inStock);
    
    // specs
    setMaterial(prod.fabricInfo.material || '');
    setPieces(prod.fabricInfo.pieces || '');
    setMeasurement(prod.fabricInfo.measurement || '');
    setStitchType(prod.fabricInfo.stitchType || 'Unstitched');
    setSeason(prod.fabricInfo.season || '');

    setActiveTab('add-product');
  };

  const handleAddNewProductClick = () => {
    setEditingProductId(null);
    setName('');
    setDescription('');
    setPrice(3000);
    setOriginalPrice(undefined);
    setProductCategory(categories[0]?.id || 'gents');
    setProductImages([]);
    setTag('');
    setColors('Emerald Green, Indigo Blue');
    setInStock(true);
    setMaterial('Premium Lawn');
    setPieces('3-Piece');
    setMeasurement('Kameez: 2.5m, Trouser: 2.5m, Dupatta: 2.5m');
    setStitchType('Unstitched');
    setSeason('Summer collection');

    setActiveTab('add-product');
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setDeleteConfirm({
      type: 'product',
      id: productId,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${prod?.name || 'this item'}"? This action cannot be undone.`
    });
  };

  // Submit Product Add/Edit
  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !productCategory) {
      alert('Please fill out Name, Price and Category.');
      return;
    }

    if (productImages.length < 2) {
      alert('Please upload at least 2 images for the product (Maximum 5).');
      return;
    }

    if (productImages.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }

    const colorsArray = colors.split(',').map(c => c.trim()).filter(c => c !== '');

    const productPayload: Product = {
      id: editingProductId || `p-custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: productCategory as any,
      images: productImages,
      tag: tag.trim() || undefined,
      inStock: inStock,
      colors: colorsArray.length > 0 ? colorsArray : ['Standard'],
      fabricInfo: {
        material: material.trim(),
        pieces: pieces.trim(),
        measurement: measurement.trim(),
        stitchType: stitchType,
        season: season.trim()
      }
    };

    if (editingProductId) {
      // Edit mode
      const updated = products.map(p => p.id === editingProductId ? productPayload : p);
      onSaveProducts(updated);
      alert('Product updated successfully!');
    } else {
      // Add mode
      const updated = [...products, productPayload];
      onSaveProducts(updated);
      alert('Product created successfully!');
    }

    // Reset
    setActiveTab('products');
    setEditingProductId(null);
  };

  // Create Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newCatId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const nameStr = newCatName.trim();

    if (!id || !nameStr) return;
    if (categories.some(c => c.id === id)) {
      alert('A category with this ID already exists!');
      return;
    }

    const updated = [...categories, { id, name: nameStr }];
    onSaveCategories(updated);
    setNewCatId('');
    setNewCatName('');
  };

  // Delete Category
  const handleDeleteCategory = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    setDeleteConfirm({
      type: 'category',
      id: catId,
      title: 'Delete Category',
      message: `Are you sure you want to delete the category "${cat?.name || 'this category'}"? Products on this category won't be visible unless changed to a valid category.`
    });
  };

  // Edit Category Name
  const handleSaveCategoryEdit = (catId: string) => {
    if (!editingCatName.trim()) return;
    const updated = categories.map(c => c.id === catId ? { ...c, name: editingCatName.trim() } : c);
    onSaveCategories(updated);
    setEditingCatId(null);
    setEditingCatName('');
  };

  // Create Collection
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newColId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const nameStr = newColName.trim();
    if (!id || !nameStr) return;

    if (!newColImage) {
      alert('Please upload exactly 1 banner image from your device for the collection.');
      return;
    }

    if (collections.some(col => col.id === id)) {
      alert('A collection with this ID already exists!');
      return;
    }

    const updated = [...collections, {
      id,
      name: nameStr,
      desc: newColDesc.trim() || 'Custom collection',
      image: newColImage
    }];
    onSaveCollections(updated);
    setNewColId('');
    setNewColName('');
    setNewColDesc('');
    setNewColImage('');
  };

  // Delete Collection
  const handleDeleteCollection = (colId: string) => {
    const col = collections.find(c => c.id === colId);
    setDeleteConfirm({
      type: 'collection',
      id: colId,
      title: 'Delete Frontpage Collection',
      message: `Are you sure you want to delete the collection card "${col?.name || 'this collection'}" from the Home Screen?`
    });
  };

  // Edit Collection Submit
  const handleSaveCollectionEdit = (colId: string) => {
    if (!editingColName.trim()) return;
    
    if (!editingColImage) {
      alert('Please upload exactly 1 banner image for the collection.');
      return;
    }

    const updated = collections.map(col => col.id === colId ? {
      ...col,
      name: editingColName.trim(),
      desc: editingColDesc.trim(),
      image: editingColImage
    } : col);
    onSaveCollections(updated);
    setEditingColId(null);
    setEditingColName('');
    setEditingColDesc('');
    setEditingColImage('');
  };

  // Reset to default fabrics
  const handleRestoreDefaults = () => {
    setDeleteConfirm({
      type: 'restore',
      id: '',
      title: 'Restore Store Defaults',
      message: 'Are you sure you want to restore all products, categories, and collections to system defaults? This will erase your custom additions.'
    });
  };

  // Handle Confirmed Actions for Custom Confirmation Dialog
  const handleConfirmAction = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'product') {
      const updated = products.filter(p => p.id !== deleteConfirm.id);
      onSaveProducts(updated);
    } else if (deleteConfirm.type === 'category') {
      const updated = categories.filter(c => c.id !== deleteConfirm.id);
      onSaveCategories(updated);
    } else if (deleteConfirm.type === 'collection') {
      const updated = collections.filter(c => c.id !== deleteConfirm.id);
      onSaveCollections(updated);
    } else if (deleteConfirm.type === 'restore') {
      localStorage.removeItem('alhand_products');
      localStorage.removeItem('alhand_categories');
      localStorage.removeItem('alhand_collections');
      window.location.reload();
    }

    setDeleteConfirm(null);
  };

  // Render Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#12110F]/5 py-12" id="admin-lock-screen">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full border border-purple-200/50 flex items-center justify-center text-purple-600">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2.5xl font-serif font-black text-[#2C1D11] tracking-tight">Al-Hamd Admin Portal</h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Please authenticate with the password provided by owner Zaffar Iqbal to manage products and collections.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Security Password</label>
              <input 
                id="admin-pass-field"
                type="password" 
                placeholder="••••••••••••••"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:bg-white"
                required
              />
            </div>

            {passwordError && (
              <p className="text-red-600 text-[11px] font-semibold flex items-center gap-1 justify-center bg-red-50 py-1.5 rounded-lg border border-red-100">
                ⚠️ {passwordError}
              </p>
            )}

            <button 
              id="admin-login-button"
              type="submit"
              className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-stone-100 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="pt-2 text-[11px] text-stone-400">
            <button onClick={onBackToShop} className="hover:text-stone-700 underline font-medium">← Back to Outlet Homepage</button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered products for admin list view
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
                          p.description.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesCategory = adminCategoryFilter === 'all' || p.category === adminCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20 font-sans" id="admin-dashboard-container">
      {/* Admin Title Banner */}
      <div className="bg-[#12110F] text-white py-10 px-4 sm:px-6 relative border-b-2 border-purple-500/20 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sliders className="w-3 h-3" /> System Console
              </span>
              <span className="text-stone-500 text-xs">•</span>
              <span className="text-amber-400 text-xs font-semibold">Manga Mandi, Lahore</span>
            </div>
            <h1 className="text-2.5xl sm:text-3xl font-serif font-black tracking-tight text-[#FAF6F0]">
              Zaffar Iqbal's Fabric Admin
            </h1>
            <p className="text-stone-400 text-xs">
              Manage live unstitched materials, create categories, and edit collections.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button 
              id="admin-restore-btn"
              onClick={handleRestoreDefaults}
              className="px-4 py-2.5 bg-stone-850 hover:bg-stone-800 border border-stone-800 text-[#FAF6F0] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore Defaults
            </button>
            <button 
              id="admin-close-btn"
              onClick={onBackToShop}
              className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-stone-100 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Sign Out & Back to Store
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs inside panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
          <button
            id="tab-btn-products"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'products' ? 'bg-purple-700 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'}`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Manage Products ({products.length})</span>
          </button>
          <button
            id="tab-btn-add"
            onClick={handleAddNewProductClick}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'add-product' && !editingProductId ? 'bg-purple-700 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
          <button
            id="tab-btn-taxonomies"
            onClick={() => setActiveTab('categories-collections')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'categories-collections' ? 'bg-purple-700 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'}`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Categories & Collections</span>
          </button>
        </div>
      </div>

      {/* Primary Section Renderer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        
        {/* TAB 1: Products list view */}
        {activeTab === 'products' && (
          <div className="space-y-6" id="admin-tab-products">
            {/* Filtering section */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
              <div className="w-full md:w-1/2 flex gap-2">
                <input 
                  id="admin-search-products-field"
                  type="text" 
                  placeholder="Search products by title, spec..."
                  value={adminSearch}
                  onChange={e => setAdminSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 focus:bg-white"
                />
                {adminSearch && (
                  <button 
                    onClick={() => setAdminSearch('')}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-xl text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="w-full md:w-auto flex items-center gap-2 self-start md:self-auto text-left">
                <span className="text-xs text-stone-400 font-semibold uppercase">Category:</span>
                <select
                  id="admin-category-filter-select"
                  value={adminCategoryFilter}
                  onChange={e => setAdminCategoryFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-purple-600"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products grid table */}
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="admin-products-table">
                  <thead className="bg-[#12110F] text-[#FAF6F0] text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-5">Fabric Info</th>
                      <th className="py-4 px-4 hidden sm:table-cell">Category</th>
                      <th className="py-4 px-4">Price (PKR)</th>
                      <th className="py-4 px-4 hidden md:table-cell">Stitch / Material</th>
                      <th className="py-4 px-4">Stock Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400 italic">
                          No fabrics found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-purple-50/10 transition-colors">
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              <img 
                                src={prod.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80'} 
                                alt={prod.name} 
                                className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="font-extrabold text-stone-900 line-clamp-1">{prod.name}</span>
                                {prod.tag && (
                                  <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-md uppercase mt-0.5 inline-block">
                                    {prod.tag}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell uppercase font-bold text-stone-500">
                            {categories.find(c => c.id === prod.category)?.name || prod.category}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-stone-900">
                            <div className="flex flex-col">
                              <span>Rs. {prod.price.toLocaleString()}</span>
                              {prod.originalPrice && (
                                <span className="text-stone-450 text-[10px] line-through">Rs. {prod.originalPrice.toLocaleString()}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell text-stone-500">
                            <span className="font-semibold block text-stone-750">{prod.fabricInfo.material}</span>
                            <span className="text-[10px]">{prod.fabricInfo.pieces} • {prod.fabricInfo.stitchType}</span>
                          </td>
                          <td className="py-3 px-4">
                            {prod.inStock ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-105 text-emerald-800 font-bold rounded-full text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-105 text-stone-500 font-bold rounded-full text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span> Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-5 text-right whitespace-nowrap">
                            <button
                              id={`edit-prod-${prod.id}`}
                              onClick={() => handleEditProduct(prod)}
                              className="p-1 px-2.5 bg-stone-100 hover:bg-purple-100 hover:text-purple-700 text-stone-600 rounded-lg font-bold transition-all mr-1.5 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              id={`delete-prod-${prod.id}`}
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1 px-1.5 bg-stone-100 hover:bg-red-55/90 hover:text-red-600 text-stone-400 rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Dynamic Add / Edit Product View */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm flex flex-col items-center" id="admin-tab-add-product">
            <div className="w-full text-left max-w-4xl">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-serif font-black text-[#2C1D11] tracking-tight">
                    {editingProductId ? 'Edit Unstitched Fabric Details' : 'Introduce New Fabric Material'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {editingProductId ? 'Alter attributes that propagate instantly to storefront filters and checkout.' : 'Introduce custom premium fabrics to client choices.'}
                  </p>
                </div>
                <button
                  id="cancel-add-product-btn"
                  onClick={() => setActiveTab('products')}
                  className="p-2 bg-stone-50 hover:bg-stone-100 rounded-full border border-stone-200/50"
                >
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <form onSubmit={handleSaveProductSubmit} className="space-y-6">
                
                {/* Product Name and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Fabric/Product Name *</label>
                    <input 
                      id="form-product-name"
                      type="text" 
                      placeholder="e.g. Areej Embroidered Cambric Latha"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-purple-650 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Select Category *</label>
                    <select
                      id="form-product-category"
                      value={productCategory}
                      onChange={e => setProductCategory(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-purple-650 focus:bg-white"
                      required
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Storefront Description</label>
                  <textarea 
                    id="form-product-desc"
                    rows={3}
                    placeholder="Provide description focusing on colors, loom weave, starch accuracy, and royal Punjabi heritage..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-purple-650 focus:bg-white"
                  />
                </div>

                {/* Prices and Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Selling Price in PKR (Rs) *</label>
                    <input 
                      id="form-product-price"
                      type="number" 
                      placeholder="3500"
                      value={price || ''}
                      onChange={e => setPrice(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-purple-650 focus:bg-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Original Price in PKR (Strike-through)</label>
                    <input 
                      id="form-product-origprice"
                      type="number" 
                      placeholder="e.g. 4200 (Optional)"
                      value={originalPrice || ''}
                      onChange={e => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-purple-650 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">Promotion Badge Tag</label>
                    <input 
                      id="form-product-tag"
                      type="text" 
                      placeholder="e.g. Bestseller, New Arrival, 15% Off"
                      value={tag}
                      onChange={e => setTag(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-purple-650 focus:bg-white"
                    />
                  </div>
                </div>

                {/* In stock and Color Swatch inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-3">
                    <input 
                      id="form-product-instock"
                      type="checkbox"
                      checked={inStock}
                      onChange={e => setInStock(e.target.checked)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-stone-300 rounded"
                    />
                    <div>
                      <label htmlFor="form-product-instock" className="text-xs font-bold text-stone-800 cursor-pointer block">Toggle In Stock at Warehouse</label>
                      <span className="text-[10px] text-stone-400 block">Out of stock products remain viewable but display an Out Of Stock badge.</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A27C44]">Available Color Shades (Comma-separated)</label>
                    <input 
                      id="form-product-colors"
                      type="text" 
                      placeholder="Emerald Green, Jet Black, Soft Lavender, Sand Beige"
                      value={colors}
                      onChange={e => setColors(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-1 focus:ring-[#A27C44]"
                    />
                    <p className="text-[10px] text-stone-400">Allows customer to select preferred sewing dye color before checkout.</p>
                  </div>
                </div>

                {/* Fabric Specifications Section */}
                <div className="space-y-4 border-2 border-dashed border-stone-200 rounded-2xl p-5 bg-[#FAF6F0]/20">
                  <span className="text-[#A27C44] text-[10px] font-extrabold uppercase tracking-widest block">Technical Fabric Specifications (Displayed in Detail view)</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-stone-400 uppercase">Composition Material</label>
                      <input 
                        id="form-product-material"
                        type="text" 
                        placeholder="e.g. Superfine Airjet Lawn / Cotton Blend"
                        value={material}
                        onChange={e => setMaterial(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#A27C44]"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-stone-400 uppercase">Pieces Option</label>
                      <input 
                        id="form-product-pieces"
                        type="text" 
                        placeholder="e.g. 3-Piece Suite / Custom 4.5m"
                        value={pieces}
                        onChange={e => setPieces(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#A27C44]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-stone-400 uppercase">Measurements Details</label>
                      <input 
                        id="form-product-measurement"
                        type="text" 
                        placeholder="Kameez: 2.5m, Trouser: 2.5m"
                        value={measurement}
                        onChange={e => setMeasurement(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#A27C44]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-stone-400 uppercase">Stitching Type</label>
                      <select
                        id="form-product-stitch"
                        value={stitchType}
                        onChange={e => setStitchType(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#A27C44]"
                      >
                        <option value="Unstitched">Unstitched Fabric</option>
                        <option value="Stitched">Pre-Stitched / Ready to Wear</option>
                        <option value="Both">Both unstitched & stitched available</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-[10px] font-bold text-stone-400 uppercase">Wear Season/Festive Vibe</label>
                      <input 
                        id="form-product-season"
                        type="text" 
                        placeholder="e.g. Summer Lawn collection / Eid Festive / Winter Karandi"
                        value={season}
                        onChange={e => setSeason(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#A27C44]"
                      />
                    </div>
                  </div>
                </div>

                {/* Images Section with interactive file upload & previews */}
                <div className="space-y-4 bg-stone-50 p-6 rounded-2xl border border-stone-200/50">
                  <div className="flex items-center justify-between border-b border-stone-200/40 pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-800 uppercase tracking-wide">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      <span>Upload Fabric Material Photos *</span>
                    </div>
                    <span className={`text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full ${productImages.length >= 2 && productImages.length <= 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-850'}`}>
                      {productImages.length} of 5 uploaded (Min 2, Max 5)
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-stone-400">
                    Upload premium unstitched or product closeup shots from your files. High resolution photos are auto-optimized for extreme speed.
                  </p>

                  {/* Upload Dropzone */}
                  {productImages.length < 5 && (
                    <label 
                      className="border-2 border-dashed border-stone-300 hover:border-purple-500 rounded-2xl p-6 bg-white cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center text-stone-500 hover:bg-purple-50/5 active:scale-[0.99]"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        const files = e.dataTransfer.files;
                        if (files) {
                          handleUploadFiles(Array.from(files));
                        }
                      }}
                    >
                      <Plus className="w-8 h-8 text-stone-400" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-stone-700">Click or Drag & Drop to Upload Photo(s)</p>
                        <p className="text-[10px] text-stone-400 font-mono">JPG, PNG, WEBP files are supported (Minimum 2, Maximum 5)</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={e => {
                          const files = e.target.files;
                          if (files) {
                            handleUploadFiles(Array.from(files));
                          }
                        }}
                      />
                    </label>
                  )}

                  {/* Image Previews / List */}
                  {productImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
                      {productImages.map((src, idx) => (
                        <div key={idx} className="group relative aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                          <img 
                            src={src} 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                            {idx === 0 ? 'COVER' : `#${idx + 1}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = productImages.filter((_, i) => i !== idx);
                              setProductImages(updated);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-650 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {productImages.length < 2 && (
                    <p className="text-[11px] text-amber-700 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 mt-2">
                       Please upload at least 2 photos of this fabric (Cover photo + closeup details) to satisfy storefront catalog requirements.
                    </p>
                  )}
                </div>

                {/* Form submits */}
                <div className="flex gap-3 pt-4 border-t border-stone-100">
                  <button
                    id="submit-product-form"
                    type="submit"
                    className="px-6 py-3.5 bg-purple-700 hover:bg-purple-800 text-stone-100 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProductId ? 'Save Product Modifications' : 'Publish Product to Live Shop'}</span>
                  </button>
                  <button
                    id="cancel-product-form"
                    type="button"
                    onClick={() => { setActiveTab('products'); setEditingProductId(null); }}
                    className="px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-650 rounded-xl font-bold text-xs border border-stone-200"
                  >
                    Discard
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* TAB 3: Categories & Collections Creation Dashboard */}
        {activeTab === 'categories-collections' && (
          <div className="space-y-8" id="admin-tab-categories-collections">
            
            {/* Banner info */}
            <div className="bg-purple-50 border border-purple-200/50 p-4 rounded-2xl text-left">
              <span className="text-purple-700 font-bold text-xs block">💡 Taxonomy System Guide</span>
              <p className="text-stone-600 text-[11px] leading-relaxed mt-1">
                <strong>Categories</strong> map directly to search catalog selectors and filters in your sidebar.
                <strong>Collections</strong> manage the home-screen layout grids (Men's collection, Wedding fancy collection, etc.). When a customer clicks a collection card on the homepage, they will see catalog results linked with that taxonomy name.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              
              {/* Category pane */}
              <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h4 className="text-lg font-serif font-black text-[#2C1D11]">Manage Categories</h4>
                  <p className="text-xs text-stone-400">Create or remove tabs in the product sorting bar.</p>
                </div>

                {/* Form: Add Category */}
                <form onSubmit={handleCreateCategory} className="bg-stone-50 border p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A27C44] block">Add New Category</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-450 uppercase block">Category ID/Url Name *</label>
                      <input 
                        id="new-cat-id-field"
                        type="text" 
                        placeholder="e.g. ladies-wash"
                        value={newCatId}
                        onChange={e => setNewCatId(e.target.value)}
                        className="bg-white border rounded-lg px-2.5 py-1.5 text-xs w-full focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-450 uppercase block">Display Name *</label>
                      <input 
                        id="new-cat-name-field"
                        type="text" 
                        placeholder="e.g. Ladies Washable"
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        className="bg-white border rounded-lg px-2.5 py-1.5 text-xs w-full focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    id="new-cat-submit"
                    type="submit" 
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Category
                  </button>
                </form>

                {/* Categories lists */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
                      {editingCatId === cat.id ? (
                        <div className="flex gap-2 w-full">
                          <input 
                            type="text"
                            value={editingCatName}
                            onChange={e => setEditingCatName(e.target.value)}
                            className="bg-white border rounded px-2 py-1 w-full text-xs"
                          />
                          <button 
                            onClick={() => handleSaveCategoryEdit(cat.id)}
                            className="bg-emerald-600 text-white p-1 px-2.5 rounded hover:bg-emerald-700"
                          >
                            <Save className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setEditingCatId(null)}
                            className="bg-stone-300 text-stone-700 p-1 px-2 rounded hover:bg-stone-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col text-left">
                            <span className="font-extrabold text-stone-900">{cat.name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">ID: {cat.id}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                              className="px-2 py-1 bg-stone-200 hover:bg-purple-100 hover:text-purple-700 text-stone-600 font-bold rounded"
                            >
                              Rename
                            </button>
                            {cat.id !== 'all' && (
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1 px-2 bg-stone-200 hover:bg-red-100 hover:text-red-700 text-stone-400 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Collections pane */}
              <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h4 className="text-lg font-serif font-black text-[#2C1D11]">Manage Collections</h4>
                  <p className="text-xs text-stone-400">Design cards on the Home screen representing sections.</p>
                </div>

                {/* Form: Add Collection */}
                <form onSubmit={handleCreateCollection} className="bg-stone-50 border p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A27C44] block">Add New Frontpage Collection Card</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-450 uppercase block">Collection ID (Must Match a Category ID!) *</label>
                      <input 
                        id="new-col-id-field"
                        type="text" 
                        placeholder="e.g. gents"
                        value={newColId}
                        onChange={e => setNewColId(e.target.value)}
                        className="bg-white border rounded-lg px-2.5 py-1.5 text-xs w-full focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-450 uppercase block">Collection Title *</label>
                      <input 
                        id="new-col-name-field"
                        type="text" 
                        placeholder="e.g. Gents suiting"
                        value={newColName}
                        onChange={e => setNewColName(e.target.value)}
                        className="bg-white border rounded-lg px-2.5 py-1.5 text-xs w-full focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-450 uppercase block">Short Slogan / Tagline description *</label>
                      <input 
                        id="new-col-desc-field"
                        type="text" 
                        placeholder="e.g. Premium wardrobe suiting"
                        value={newColDesc}
                        onChange={e => setNewColDesc(e.target.value)}
                        className="bg-white border rounded-lg px-2.5 py-1.5 text-xs w-full focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-stone-450 uppercase block">Collection Banner Card Image *</label>
                      {newColImage ? (
                        <div className="relative w-full h-[34px] bg-stone-100 border border-stone-200 rounded-lg overflow-hidden flex items-center justify-between px-2">
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <img 
                              src={newColImage} 
                              alt="New banner" 
                              className="w-6 h-6 object-cover rounded shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-[10px] font-mono text-stone-550 truncate">Device Photo Attached</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewColImage('')}
                            className="p-1 hover:bg-stone-250 text-red-650 rounded cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="border border-dashed border-stone-300 hover:border-purple-500 rounded-lg h-[34px] bg-white cursor-pointer transition-all flex items-center justify-center gap-1.5 py-1 shadow-sm hover:bg-stone-50">
                          <Plus className="w-3.5 h-3.5 text-stone-450" />
                          <span className="text-[10px] font-bold text-stone-650">Select Device File</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const files = e.target.files;
                              if (files && files[0]) {
                                handleUploadSingleFile(files[0], setNewColImage);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <button 
                    id="new-col-submit"
                    type="submit" 
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Collection Card
                  </button>
                </form>

                {/* Collections list */}
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {collections.map(col => (
                    <div key={col.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-left">
                      {editingColId === col.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              value={editingColName}
                              onChange={e => setEditingColName(e.target.value)}
                              placeholder="Title"
                              className="bg-white border rounded px-2 py-1.5 text-xs w-full"
                            />
                            <input 
                              type="text" 
                              value={editingColDesc}
                              onChange={e => setEditingColDesc(e.target.value)}
                              placeholder="Description"
                              className="bg-white border rounded px-2 py-1.5 text-xs w-full"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-stone-400 uppercase block">Banner Image *</label>
                            {editingColImage ? (
                              <div className="relative w-full h-[34px] bg-stone-100 border border-stone-200 rounded-lg overflow-hidden flex items-center justify-between px-2">
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                  <img 
                                    src={editingColImage} 
                                    alt="Edit banner" 
                                    className="w-6 h-6 object-cover rounded shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="text-[10px] font-mono text-stone-550 truncate">Device Photo Attached</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setEditingColImage('')}
                                  className="p-1 hover:bg-stone-250 text-red-650 rounded cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <label className="border border-dashed border-stone-300 hover:border-purple-500 rounded-lg h-[34px] bg-white cursor-pointer transition-all flex items-center justify-center gap-1.5 py-1 shadow-sm hover:bg-stone-50">
                                <Plus className="w-3.5 h-3.5 text-stone-450" />
                                <span className="text-[10px] font-bold text-stone-650">Select Device File</span>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const files = e.target.files;
                                    if (files && files[0]) {
                                      handleUploadSingleFile(files[0], setEditingColImage);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                          <div className="flex gap-1 justify-end">
                            <button 
                              onClick={() => handleSaveCollectionEdit(col.id)}
                              className="bg-emerald-600 text-white p-1 px-3 rounded hover:bg-emerald-700 font-bold"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingColId(null)}
                              className="bg-stone-300 text-stone-700 p-1 px-2.5 rounded hover:bg-stone-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <img 
                            src={col.image} 
                            alt={col.name} 
                            className="w-12 h-12 object-cover rounded-md border border-stone-250-80 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-grow text-left">
                            <h5 className="font-extrabold text-stone-900 leading-tight">{col.name}</h5>
                            <p className="text-[10px] text-stone-500 line-clamp-1">{col.desc}</p>
                            <span className="text-[9px] font-mono text-stone-400 mt-0.5 block">Category filter: {col.id}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => { 
                                setEditingColId(col.id); 
                                setEditingColName(col.name); 
                                setEditingColDesc(col.desc); 
                                setEditingColImage(col.image); 
                              }}
                              className="px-2 py-1 bg-stone-200 hover:bg-purple-100 hover:text-purple-700 text-[#2C1D11] rounded font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCollection(col.id)}
                              className="p-1 px-2 bg-stone-200 hover:bg-red-100 hover:text-red-705 text-stone-400 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Custom Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-250">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full border border-red-200/55 flex items-center justify-center text-red-600">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-black text-[#2C1D11] tracking-tight">{deleteConfirm.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {deleteConfirm.message}
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 cursor-pointer"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
