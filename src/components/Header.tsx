import React, { useState } from 'react';
import { ShoppingBag, Phone, MapPin, Menu, X, Search, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  cartCount: number;
}

export default function Header({ currentView, onNavigate, cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (type: string, category?: string) => {
    if (currentView.type !== type) return false;
    if (type === 'products' && category) {
      return (currentView as any).filterCategory === category;
    }
    return true;
  };

  const navClass = (type: string, category?: string) => `
    relative py-2 text-[13px] font-bold tracking-wide transition-all duration-300 cursor-pointer
    ${isActive(type, category) 
      ? 'text-[#A27C44] border-b-2 border-[#A27C44]' 
      : 'text-[#1E160D] hover:text-[#A27C44]'}
  `;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate({ type: 'products', filterCategory: 'all' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/65 font-sans">
      {/* Top micro bar with genuine leather gold aesthetic contact */}
      <div className="bg-[#12110F] text-stone-100 text-[11px] py-1.5 px-4 border-b border-[#A27C44]/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-1.5 text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-[#A27C44]" />
            <span className="truncate text-[11px]">Premium Fabrics, Timeless Style • Main Raiwind Road, Manga Mandi, Lahore</span>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="https://wa.me/923053131133" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-stone-200 hover:text-[#A27C44]"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Hotline: +92 305 3131133</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Brand & Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo block */}
        <div 
          onClick={() => onNavigate({ type: 'home' })}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          id="logo-brand"
        >
          {/* Circular Gold Crest Logo matching reference */}
          <div className="w-10 h-10 rounded-full border border-[#A27C44] flex items-center justify-center bg-[#FAF6F0] group-hover:scale-105 transition-transform duration-300 shrink-0">
            <span className="font-serif text-[#A27C44] text-base font-bold">A</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl sm:text-2xl font-serif font-black tracking-widest text-[#1E1103]">
              Al-Hamd
            </span>
            <span className="text-[9px] tracking-[0.2em] text-[#A27C44] font-extrabold uppercase -mt-1 block">
              — FABRIC —
            </span>
          </div>
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
          <div onClick={() => onNavigate({ type: 'home' })} className={navClass('home')}>
            Home
          </div>
          <div onClick={() => onNavigate({ type: 'about' })} className={navClass('about')}>
            About Us
          </div>
          <div onClick={() => onNavigate({ type: 'products', filterCategory: 'all' })} className={navClass('products')}>
            Collections
          </div>
          <div onClick={() => onNavigate({ type: 'products', filterCategory: 'gents' })} className={navClass('products', 'gents')}>
            Men
          </div>
          <div onClick={() => onNavigate({ type: 'products', filterCategory: 'ladies-3pc' })} className={navClass('products', 'ladies-3pc')}>
            Women
          </div>
          <div onClick={() => onNavigate({ type: 'products', filterCategory: 'all' })} className={navClass('products')}>
            New Arrivals
          </div>
          <div onClick={() => onNavigate({ type: 'about' })} className={navClass('about')}>
            Contact
          </div>
        </nav>

        {/* Action icons (Cart, Search, Shop Now Button) */}
        <div className="flex items-center gap-3 sm:gap-4.5">
          {/* Subtle search input */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <input 
              type="text" 
              placeholder="Search fabrics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-stone-50 hover:bg-stone-100 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#A27C44] focus:border-[#A27C44] rounded-full text-xs py-1.5 pl-3.5 pr-8 w-36 transition-all focus:w-48 text-stone-800"
            />
            <button type="submit" className="absolute right-2.5 text-stone-400 hover:text-[#A27C44]">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Golden Shop Now Button exactly matching mockup screenshot */}
          <button
            onClick={() => onNavigate({ type: 'products', filterCategory: 'all' })}
            className="hidden md:flex items-center gap-2 bg-[#A27C44] hover:bg-[#8F6A34] text-white text-xs font-bold px-4 py-2.5 rounded shadow-sm hover:shadow-md transition-all cursor-pointer text-[11px] uppercase tracking-wider"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop Now</span>
          </button>

          {/* Mobile hamburger button */}
          <button 
            className="lg:hidden p-1.5 rounded-lg text-stone-700 hover:bg-stone-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200 py-4 px-4 shadow-inner space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex sm:hidden items-center relative w-full">
            <input 
              type="text" 
              placeholder="Search lawn, cotton..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-stone-100 focus:bg-white border border-stone-200 focus:ring-1 focus:ring-amber-500 rounded-lg text-sm py-2 pl-3 pr-8 w-full text-stone-800"
            />
            <button type="submit" className="absolute right-3 text-stone-500">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button 
              onClick={() => { onNavigate({ type: 'home' }); setMobileMenuOpen(false); }}
              className={`p-3 rounded-lg text-left ${isActive('home') ? 'bg-amber-100 font-bold text-amber-950' : 'bg-stone-100 text-stone-700'}`}
            >
              Home
            </button>
            <button 
              onClick={() => { onNavigate({ type: 'products', filterCategory: 'all' }); setMobileMenuOpen(false); }}
              className={`p-3 rounded-lg text-left ${isActive('products') && !(currentView as any).filterCategory ? 'bg-amber-100 font-bold text-amber-950' : 'bg-stone-100 text-stone-700'}`}
            >
              Shop All
            </button>
            <button 
              onClick={() => { onNavigate({ type: 'products', filterCategory: 'ladies-3pc' }); setMobileMenuOpen(false); }}
              className={`p-3 rounded-lg text-left ${isActive('products', 'ladies-3pc') ? 'bg-amber-100 font-bold text-amber-950' : 'bg-stone-100 text-stone-700'}`}
            >
              Ladies 3-PC
            </button>
            <button 
              onClick={() => { onNavigate({ type: 'products', filterCategory: 'ladies-2pc' }); setMobileMenuOpen(false); }}
              className={`p-3 rounded-lg text-left ${isActive('products', 'ladies-2pc') ? 'bg-amber-100 font-bold text-amber-950' : 'bg-stone-100 text-stone-700'}`}
            >
              Ladies 2-PC
            </button>
            <button 
              onClick={() => { onNavigate({ type: 'products', filterCategory: 'gents' }); setMobileMenuOpen(false); }}
              className={`p-3 rounded-lg text-left ${isActive('products', 'gents') ? 'bg-amber-100 font-bold text-amber-950' : 'bg-stone-100 text-stone-700'}`}
            >
              Gents Collection
            </button>
            <button 
              onClick={() => { onNavigate({ type: 'about' }); setMobileMenuOpen(false); }}
              className={`p-3 rounded-lg text-left ${isActive('about') ? 'bg-amber-100 font-bold text-amber-950' : 'bg-stone-100 text-stone-700'}`}
            >
              Contact Us
            </button>
          </div>
          <div className="pt-2 flex justify-between items-center text-xs text-stone-500 border-t border-stone-200">
            <span>Raiwind Road, Manga Mandi</span>
            <a href="tel:03053131133" className="text-emerald-800 font-semibold flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600" /> 03053131133
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
