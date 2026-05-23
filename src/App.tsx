/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewState, CartItem, Product } from './types';
import { PRODUCTS, CATEGORIES, SHOP_REVIEWS } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import AboutOwner from './components/AboutOwner';
import PrivacyPolicy from './components/PrivacyPolicy';
import AdminPanel from './components/AdminPanel';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  ChevronRight, 
  ShieldCheck, 
  ScrollText, 
  Share2 
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'home' });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Dynamic products database state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string; desc: string; image: string }[]>([]);

  // Synchronous initial loading of dynamic states
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('alhand_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(PRODUCTS);
      }
    } catch (e) {
      console.error('Failed to parse products', e);
      setProducts(PRODUCTS);
    }

    try {
      const savedCategories = localStorage.getItem('alhand_categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        const defaultCats = [
          { id: 'ladies-3pc', name: 'Ladies 3-Piece' },
          { id: 'ladies-2pc', name: 'Ladies 2-Piece' },
          { id: 'gents', name: 'Gents Collection' },
          { id: 'wedding-fancy', name: 'Wedding & Fancy' }
        ];
        setCategories(defaultCats);
      }
    } catch (e) {
      console.error('Failed to parse categories', e);
      setCategories([
        { id: 'ladies-3pc', name: 'Ladies 3-Piece' },
        { id: 'ladies-2pc', name: 'Ladies 2-Piece' },
        { id: 'gents', name: 'Gents Collection' },
        { id: 'wedding-fancy', name: 'Wedding & Fancy' }
      ]);
    }

    try {
      const savedCollections = localStorage.getItem('alhand_collections');
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      } else {
        const defaultCols = [
          { id: 'gents', name: "Men's Collection", desc: "Premium wardrobe suiting", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80" },
          { id: 'ladies-3pc', name: "Women's Collection", desc: "Elegant printed lawns", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80" },
          { id: 'wedding-fancy', name: "Luxury Festive", desc: "Exclusive royal looks", image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=500&q=80" },
          { id: 'all', name: "New Arrivals", desc: "Latest cotton designs", image: "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=500&q=80" }
        ];
        setCollections(defaultCols);
      }
    } catch (e) {
      console.error('Failed to parse collections', e);
    }
  }, []);

  // Save states
  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('alhand_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  };

  const handleSaveCategories = (newCategories: { id: string; name: string }[]) => {
    setCategories(newCategories);
    try {
      localStorage.setItem('alhand_categories', JSON.stringify(newCategories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  };

  const handleSaveCollections = (newCollections: { id: string; name: string; desc: string; image: string }[]) => {
    setCollections(newCollections);
    try {
      localStorage.setItem('alhand_collections', JSON.stringify(newCollections));
    } catch (e) {
      console.error('Failed to save collections', e);
    }
  };

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('alhand_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart items from local storage', e);
    }
  }, []);

  // Save cart to localStorage on modification
  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    try {
      localStorage.setItem('alhand_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Failed to write cart to local storage', e);
    }
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    // Auto-scroll to top on navigation to provide native multi-page feeling
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Set category state if navigated from category filters
    if (view.type === 'products' && view.filterCategory) {
      setSelectedCategory(view.filterCategory);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, color: string) => {
    const existingIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.selectedColor === color
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cartItems, { product, quantity: 1, selectedColor: color }];
    }
    saveCart(updated);
  };

  const handleUpdateQuantity = (productId: string, color: string, newQty: number) => {
    if (newQty < 1) return;
    const updated = cartItems.map(item => {
      if (item.product.id === productId && item.selectedColor === color) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveItem = (productId: string, color: string) => {
    const updated = cartItems.filter(
      item => !(item.product.id === productId && item.selectedColor === color)
    );
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // Cart count calculator
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Dynamic count categorization selectors
  const displayCategories = [
    { id: 'all', name: 'All Collection', count: products.length },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: products.filter(p => p.category === cat.id).length
    }))
  ];

  // Filtered products for Catalog page
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          product.fabricInfo.material.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Structural Header */}
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        cartCount={cartCount} 
      />

      {/* Primary Dynamic Main Content Layout */}
      <main className="flex-grow">
        {currentView.type === 'home' && (
          <div className="space-y-16 pb-20">
            {/* Elegant Hero Visual */}
            <Hero onNavigate={handleNavigate} />

            {/* Core Fabric Categories - Elegant Mockup Theme Shop by Category */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center space-y-1.5 mb-10">
                <span className="text-[#A27C44] text-[11px] font-extrabold uppercase tracking-widest block font-sans">Our Collections</span>
                <h2 className="text-2.5xl sm:text-3.5xl font-serif font-black tracking-tight text-[#2C1D11]">Shop by Category</h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-10 h-[1px] bg-[#A27C44]/40"></div>
                  <span className="text-[10px] text-[#A27C44]">◆</span>
                  <div className="w-10 h-[1px] bg-[#A27C44]/40"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {collections.map(col => (
                  <div 
                    key={col.id}
                    onClick={() => handleNavigate({ type: 'products', filterCategory: col.id })}
                    className="group relative aspect-square bg-stone-900 rounded-none overflow-hidden cursor-pointer shadow-sm border border-stone-200/80"
                  >
                    <img 
                      src={col.image || "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80"} 
                      alt={col.name} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 flex flex-col justify-end p-3 sm:p-4 text-left font-sans">
                      <h3 className="font-serif font-black text-sm sm:text-base lg:text-lg text-white">{col.name}</h3>
                      <p className="text-[9px] sm:text-[11px] text-stone-200 mt-0.5 sm:mt-1 font-sans">{col.desc}</p>
                      <button className="self-start mt-2 sm:mt-3 px-3 sm:px-4 py-1 border border-white text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-none hover:bg-white hover:text-[#2C1D11] transition-colors cursor-pointer">
                        Shop Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Hot Selling Products Stage */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-8 border-b border-stone-200/60 pb-5 text-left">
                <div>
                  <span className="text-[#A27C44] text-[11px] font-extrabold uppercase tracking-widest block font-sans">Our Outlet Best Sellers</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#2C1D11]">Hot Selling Products</h2>
                </div>
                <button 
                  onClick={() => handleNavigate({ type: 'products', filterCategory: 'all' })}
                  className="text-xs text-[#A27C44] font-black hover:text-[#8F6A34] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  View All {products.length} Fabrics →
                </button>
              </div>

              {/* Grid lists: Compact Small Grid View (2 cols on mobile, up to 4 on desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {products.slice(0, 8).map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onViewDetails={(id) => handleNavigate({ type: 'product-detail', productId: id })}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>

            {/* Interactive "Stay Updated" Newsletter - Exactly like layout mockup */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-[#FAF6F0] border border-[#A27C44]/20 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-left shadow-sm">
                <div className="flex items-start gap-4 max-w-xl">
                  {/* Clean Mailbox Emblem */}
                  <div className="p-4 bg-white rounded-full text-[#A27C44] border border-[#A27C44]/15 shrink-0 hidden sm:block">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-serif font-black text-[#2C1D11]">Stay Updated</h3>
                    <p className="text-stone-500 text-xs sm:text-xs leading-relaxed">
                      Subscribe to get the latest updates on new arrivals, offers, and exclusive unstitched suiting collections.
                    </p>
                  </div>
                </div>

                 {/* Live Interactive Form */}
                <div className="w-full lg:w-auto flex-grow max-w-md">
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const target = e.target as HTMLFormElement;
                      const nameInput = target.elements[0] as HTMLInputElement;
                      const emailInput = target.elements[1] as HTMLInputElement;
                      const name = nameInput.value.trim();
                      const email = emailInput.value.trim();
                      if (!name || !email) return;

                      const cleanEmailId = email.toLowerCase().replace(/[^a-z0-9_]/g, '_');
                      try {
                        const payload = {
                          name,
                          email,
                          subscribedAt: new Date().toISOString()
                        };

                        const subscriberRef = doc(db, 'subscribers', cleanEmailId);
                        await setDoc(subscriberRef, payload);

                        alert('Thank you for subscribing to Al Hamd Fabrics! Your subscription has been recorded securely in our database. We will send you our finest collections alerts.');
                        target.reset();
                      } catch (err) {
                        handleFirestoreError(err, OperationType.WRITE, `subscribers/${cleanEmailId}`);
                      }
                    }}
                    className="flex flex-col sm:flex-row gap-2.5 w-full"
                  >
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      required
                      className="bg-white border border-[#A27C44]/25 focus:ring-1 focus:ring-[#A27C44] focus:border-[#A27C44] rounded-lg px-3 py-2.5 text-xs text-stone-800 focus:outline-none placeholder-stone-400 flex-grow sm:w-1/3"
                    />
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      required
                      className="bg-white border border-[#A27C44]/25 focus:ring-1 focus:ring-[#A27C44] focus:border-[#A27C44] rounded-lg px-3 py-2.5 text-xs text-stone-800 focus:outline-none placeholder-stone-400 flex-grow sm:w-1/2"
                    />
                    <button 
                      type="submit"
                      className="bg-[#A27C44] hover:bg-[#8F6A34] active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-lg whitespace-nowrap tracking-wider transition-all shadow-sm cursor-pointer"
                    >
                      Subscribe Now
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Catalog Search & Grid Page */}
        {currentView.type === 'products' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-left border-b border-stone-200 pb-5">
              <div>
                <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Complete Storefront Collection</span>
                <h1 className="text-3xl font-serif font-black text-emerald-950">Our Fabrics Catalog</h1>
              </div>

              {/* Dynamic search inside code */}
              <div className="w-full md:w-72">
                <input 
                  type="text" 
                  placeholder="Filter by keyword (lawn, silk)..."
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Categorization tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {displayCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer
                    ${selectedCategory === cat.id 
                      ? 'bg-slate-950 text-amber-200 border-slate-950 shadow' 
                      : 'bg-[#FAF6F0] text-stone-600 border-[#A27C44]/20 hover:bg-[#FAF6F0]/80'}
                  `}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>

            {/* Empty view check */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-stone-100 shadow-sm max-w-xl mx-auto">
                <span className="text-4xl">💭</span>
                <h3 className="text-lg font-serif font-bold text-stone-800 mt-4">No matching fabric found</h3>
                <p className="text-stone-500 text-xs mt-1">Try resetting search filter keywords or select "All Collection" above.</p>
                <button 
                  onClick={() => { setSearchFilter(''); setSelectedCategory('all'); }}
                  className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold text-stone-700"
                >
                  Reset Selection State
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onViewDetails={(id) => handleNavigate({ type: 'product-detail', productId: id })}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Separate single Product Detail View */}
        {currentView.type === 'product-detail' && (
          <ProductDetail 
            productId={(currentView as any).productId}
            onBackToShop={() => handleNavigate({ type: 'products', filterCategory: 'all' })}
            onAddToCart={handleAddToCart}
            products={products}
          />
        )}

        {/* Checkout Shopping Cart View */}
        {currentView.type === 'cart' && (
          <Cart 
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
            onClearCart={handleClearCart}
          />
        )}

        {/* Dynamic Admin Panel */}
        {currentView.type === 'admin' && (
          <AdminPanel 
            products={products}
            categories={categories}
            collections={collections}
            onSaveProducts={handleSaveProducts}
            onSaveCategories={handleSaveCategories}
            onSaveCollections={handleSaveCollections}
            onBackToShop={() => handleNavigate({ type: 'home' })}
          />
        )}

        {/* Privacy Policy view */}
        {currentView.type === 'privacy' && <PrivacyPolicy />}

        {/* About Owner / Location View */}
        {currentView.type === 'about' && <AboutOwner />}
      </main>

      {/* FOOTER: Exquisitely styled according to the uploaded mockup theme */}
      <footer className="bg-[#12110F] text-stone-300 font-sans border-t border-[#A27C44]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 text-left">
          
          {/* Logo Crest Column */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              {/* Gold Crest Ring Emblem matching image */}
              <div className="w-12 h-12 rounded-full border border-[#A27C44] flex items-center justify-center bg-[#1A1815] shrink-0">
                <span className="font-serif text-[#A27C44] text-xl font-bold tracking-tight">A</span>
              </div>
              <div>
                <span className="text-xl font-serif font-black tracking-widest text-[#FAF6F0] block leading-none">
                  Al-Hamd
                </span>
                <span className="text-[10px] tracking-widest text-[#A27C44] font-extrabold uppercase mt-1 block">
                  — F A B R I C —
                </span>
              </div>
            </div>
            
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Al-Hamd Fabric is your trusted destination for premium quality fabrics that define elegance and tradition. Directly integrated with top weaving plants to supply pure airjet lawn, soft Boski, and rigid Egyptian cotton.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2.5 space-y-3.5">
            <h4 className="text-[#FAF6F0] font-bold text-xs uppercase tracking-widest border-b border-[#A27C44]/25 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavigate({ type: 'home' })} className="hover:text-[#A27C44] transition-colors cursor-pointer text-stone-400">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate({ type: 'about' })} className="hover:text-[#A27C44] transition-colors cursor-pointer text-stone-400">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate({ type: 'products', filterCategory: 'all' })} className="hover:text-[#A27C44] transition-colors cursor-pointer text-stone-400">
                  Collections
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate({ type: 'products', filterCategory: 'gents' })} className="hover:text-[#A27C44] transition-colors cursor-pointer text-stone-400">
                  Men
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate({ type: 'products', filterCategory: 'ladies-3pc' })} className="hover:text-[#A27C44] transition-colors cursor-pointer text-stone-400">
                  Women
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate({ type: 'products', filterCategory: 'all' })} className="hover:text-[#A27C44] transition-colors cursor-pointer text-stone-400">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate({ type: 'about' })} className="hover:text-[#A27C44] transition-colors cursor-pointer text-stone-400">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="md:col-span-2.5 space-y-3.5">
            <h4 className="text-[#FAF6F0] font-bold text-xs uppercase tracking-widest border-b border-[#A27C44]/25 pb-2">Customer Service</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><button onClick={() => handleNavigate({ type: 'about' })} className="hover:text-[#A27C44] transition-colors">FAQs</button></li>
              <li><button onClick={() => handleNavigate({ type: 'about' })} className="hover:text-[#A27C44] transition-colors">Shipping & Delivery</button></li>
              <li><button onClick={() => handleNavigate({ type: 'about' })} className="hover:text-[#A27C44] transition-colors">Returns & Exchanges</button></li>
              <li><button onClick={() => handleNavigate({ type: 'privacy' })} className="hover:text-[#A27C44] transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => handleNavigate({ type: 'privacy' })} className="hover:text-[#A27C44] transition-colors">Terms & Conditions</button></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[#FAF6F0] font-bold text-xs uppercase tracking-widest border-b border-[#A27C44]/25 pb-2">Contact Us</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2 text-stone-400">
                <MapPin className="w-4 h-4 text-[#A27C44] shrink-0" />
                <span>Manga Mandi, Main Raiwind Road, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2 text-stone-400">
                <Phone className="w-4 h-4 text-[#A27C44] shrink-0" />
                <a href="tel:03053131133" className="hover:text-[#A27C44] transition-colors font-semibold">+92 305 3131133</a>
              </li>
              <li className="flex items-center gap-2 text-stone-400">
                <svg className="w-4 h-4 text-[#A27C44] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@alhamdfabrics.pk" className="hover:text-[#A27C44] transition-colors">info@alhamdfabrics.pk</a>
              </li>
            </ul>

            {/* Social Media Circular Badge row */}
            <div className="flex items-center gap-2.5 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:border-[#A27C44] hover:text-[#A27C44] transition-colors"
              >
                <span className="text-xs font-bold font-serif">f</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:border-[#A27C44] hover:text-[#A27C44] transition-colors"
                id="footer-insta-btn"
              >
                <span className="text-[10px] font-bold select-none">🔗</span>
              </a>
              <a 
                href="https://wa.me/923053131133" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:border-[#A27C44] hover:text-[#A27C44] transition-colors"
              >
                <span className="text-xs select-none">💬</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal micro copyright layout */}
        <div className="bg-[#0A0908] text-stone-500 py-6 px-4 border-t border-stone-900 flex flex-col items-center gap-4">
          <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2024 Al-Hamd Fabric. All Rights Reserved.</p>
            <div className="flex gap-4">
              <button onClick={() => handleNavigate({ type: 'privacy' })} className="hover:text-[#FAF6F0] transition-colors cursor-pointer">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => handleNavigate({ type: 'about' })} className="hover:text-[#FAF6F0] transition-colors cursor-pointer">Store Directions</button>
            </div>
          </div>
          <div className="pt-2 w-full max-w-7xl text-center flex justify-center">
            <button 
              id="footer-admin-link"
              onClick={() => handleNavigate({ type: 'admin' })}
              className="text-purple-500 hover:text-purple-400 text-[11px] font-extrabold tracking-widest uppercase transition-all px-4 py-1.5 rounded-full bg-purple-950/15 border border-purple-550/25 active:scale-95 cursor-pointer shrink-0"
            >
              admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

