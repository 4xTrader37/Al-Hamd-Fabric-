import { Product } from '../types';
import { Eye, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  onAddToCart?: (product: Product, color: string) => void;
  key?: string;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  // Direct formatting for currency: e.g. Rs. 3,650
  const formatPrice = (num: number) => {
    return `Rs. ${num.toLocaleString('en-US')}`;
  };

  const currentPrice = product.price;
  const originalPrice = product.originalPrice;
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col font-sans"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product.id)}>
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Tags overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.tag && (
            <span className="bg-slate-950 text-amber-200 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow border border-amber-500/20">
              {product.tag}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-amber-600 text-stone-50 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Floating Quick Action overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product.id);
            }}
            className="px-4 py-2 bg-white text-[#1E1103] font-bold text-xs uppercase tracking-wider shadow-xl hover:bg-[#A27C44] hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 rounded-lg flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Product Catalog Info */}
      <div className="p-4 flex flex-col flex-grow text-left space-y-2">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] tracking-widest uppercase text-stone-400 font-bold block">
            {product.fabricInfo.pieces} • {product.fabricInfo.material.split('&')[0]}
          </span>
          <span className="bg-stone-50 border border-stone-200/60 rounded px-1.5 py-0.5 text-[9px] font-semibold text-stone-500 capitalize">
            {product.fabricInfo.stitchType}
          </span>
        </div>

        <h3 
          onClick={() => onViewDetails(product.id)}
          className="font-serif font-black text-[15px] sm:text-[16px] text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-2 leading-tight min-h-10"
        >
          {product.name}
        </h3>

        {/* Brief fabric composition */}
        <p className="text-xs text-stone-500 line-clamp-1 leading-relaxed">
          {product.fabricInfo.season} | {product.fabricInfo.measurement.split(',')[0]}
        </p>

        {/* Pricing tag block */}
        <div className="pt-2 border-t border-stone-100 flex items-end justify-between mt-auto">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-950">
              {formatPrice(currentPrice)}
            </span>
            {originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={() => onViewDetails(product.id)}
            className="text-xs text-amber-900 font-bold hover:text-slate-950 transition-colors flex items-center gap-1 group-2"
          >
            View Specs →
          </button>
        </div>
      </div>
    </div>
  );
}
