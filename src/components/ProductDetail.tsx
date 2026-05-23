import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import { 
  ArrowLeft, Send, Star, Ruler, Truck, RotateCcw, Plus, Minus
} from 'lucide-react';

interface ProductDetailProps {
  productId: string;
  onBackToShop: () => void;
  onAddToCart?: (product: Product, color: string) => void;
  products?: Product[];
}

export default function ProductDetail({ productId, onBackToShop, products = PRODUCTS }: ProductDetailProps) {
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Oops! Product not found.</h2>
        <p className="text-stone-500 mt-2">The fabric you are seeking is either out of stock or does not exist.</p>
        <button 
          onClick={onBackToShop}
          className="mt-6 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl transition-all"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });

  // Direct Booking States
  const [quantity, setQuantity] = useState(1);

  // Formatting helper for PKR Rupees
  const formatPrice = (num: number) => `Rs. ${num.toLocaleString('en-US')}`;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const added = {
      id: `user-rev-${Date.now()}`,
      name: newReview.name,
      rating: Number(newReview.rating),
      comment: newReview.comment,
      date: 'Today'
    };

    setReviewsList([added, ...reviewsList]);
    setNewReview({ name: '', comment: '', rating: 5 });
  };

  // Modern WhatsApp checkout trigger
  const handlePlaceOrderDirect = (e: React.FormEvent) => {
    e.preventDefault();

    const subtotal = product.price * quantity;
    const shippingCost = subtotal >= 5000 ? 0 : 250;
    const totalBill = subtotal + shippingCost;

    const formattedSubtotal = formatPrice(subtotal);
    const formattedShipping = shippingCost === 0 ? "FREE (COD)" : `${formatPrice(shippingCost)}`;
    const totalCOD = formatPrice(totalBill);

    // Generate dynamic WhatsApp text message
    const textMessage = `As Salaam Alaikum Al Hamd Fabrics!%0A%0A` +
                    `*NEW ORDER INQUIRY*%0A` +
                    `----------------------------------%0A` +
                    `*Fabric Choice:* ${product.name}%0A` +
                    `*Color Selected:* ${selectedColor}%0A` +
                    `*Quantity Ordered:* ${quantity} suit(s)%0A` +
                    `*Stitch Style:* ${product.fabricInfo.stitchType}%0A` +
                    `*Unit Price:* ${formatPrice(product.price)}%0A` +
                    `*Subtotal:* ${formattedSubtotal}%0A` +
                    `*Shipping Service:* ${formattedShipping}%0A` +
                    `*Total COD Amt Due:* ${totalCOD}%0A` +
                    `----------------------------------%0A` +
                    `Please check detail and ask me for my Shipping Name, Phone, and Address to confirm dispatch from Manga Mandi Outlet. JazaakAllah Khayran!`;

    const waUrl = `https://wa.me/923053131133?text=${textMessage}`;

    // Launch WhatsApp immediately in a new tab/window
    window.open(waUrl, '_blank');
  };

  // Calculations for current inline form
  const subtotal = product.price * quantity;
  const shippingCost = subtotal >= 5000 ? 0 : 250;
  const totalBill = subtotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 font-sans text-stone-800 text-left">
      {/* Back link */}
      <button 
        onClick={onBackToShop}
        className="inline-flex items-center gap-2 mb-8 text-stone-500 hover:text-[#A27C44] transition-colors font-medium cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fabrics Collection</span>
      </button>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Side: Product Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="sticky top-28 space-y-4">
            {/* Main Visual Frame */}
            <div className="aspect-[4/5] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover select-none transition-transform hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail indicators */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[4/5] bg-stone-100 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#A27C44] scale-95 shadow-md' : 'border-stone-200 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Fabric closeup ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Product & Order Forms */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[11px] tracking-widest text-amber-700 font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                {product.fabricInfo.pieces} Collection
              </span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-stone-500 text-xs font-semibold uppercase">{product.fabricInfo.season}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#2C1D11] leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Row */}
          <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 shadow-inner">
            <span className="text-3xl font-black text-[#2C1D11]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <div className="flex flex-col">
                <span className="text-sm text-stone-400 line-through leading-none">{formatPrice(product.originalPrice)}</span>
                <span className="text-[10px] text-amber-700 font-bold mt-1">
                  Save {Math.round((product.originalPrice - product.price))} Rupees ({Math.round(((product.originalPrice - product.price)/product.originalPrice)*100)}% off)
                </span>
              </div>
            )}
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                In Stock & Ready
              </span>
            </div>
          </div>

          {/* Fabric Characteristic list */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white/70 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-stone-400 font-extrabold">Fabric Specifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium font-sans">Composition:</span>
                <span className="text-stone-900 font-bold max-w-44 text-right truncate">{product.fabricInfo.material}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium font-sans">Measurements:</span>
                <span className="text-stone-900 font-bold max-w-44 text-right truncate">{product.fabricInfo.measurement}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium font-sans">Stitching Style:</span>
                <span className="text-stone-900 font-bold">{product.fabricInfo.stitchType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500 font-medium font-sans">Wear Season:</span>
                <span className="text-stone-900 font-bold">{product.fabricInfo.season}</span>
              </div>
            </div>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed border-b border-stone-200 pb-4">
            {product.description}
          </p>

          {/* COLOR SWATCH BUTTONS */}
          <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200/40">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-500 uppercase tracking-wider font-sans">Choose Fabric Color:</span>
              <span className="text-amber-800 font-sans">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`
                    px-3.5 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer
                    ${selectedColor === color 
                      ? 'bg-[#1E1103] text-amber-200 border-[#1E1103] shadow-sm' 
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-[#FAF6F0]'}
                  `}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE INLINE FAST CHECKOUT FORM */}
          <form onSubmit={handlePlaceOrderDirect} className="bg-gradient-to-br from-[#FAF6F0] to-[#EFEAE2]/50 border border-[#A27C44]/20 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="border-b border-stone-200/75 pb-2">
              <h3 className="text-base font-serif font-black text-[#2C1D11] flex items-center gap-2">
                <span className="text-[#A27C44]">💬</span>
                <span>Direct WhatsApp Order Booking</span>
              </h3>
              <p className="text-stone-500 text-[11px] font-sans mt-0.5">
                Set your quantity and click below. No forms needed! Our representative will guide you through delivery options and details.
              </p>
            </div>

            {/* Quantity Increment controls */}
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-sm">
              <span className="text-xs text-stone-500 font-bold">Quantity (No. of suits):</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { if (quantity > 1) setQuantity(quantity - 1); }}
                  className="w-8 h-8 rounded-full border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors active:scale-95 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-extrabold text-stone-900 w-6 text-center select-none font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subtotal Order receipt card */}
            <div className="bg-white/60 p-3.5 rounded-xl border border-[#A27C44]/15 text-xs text-left text-stone-600 space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span>Unit Price:</span>
                <span className="font-bold text-stone-800">{formatPrice(product.price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Quantity:</span>
                <span className="font-bold text-stone-800">x{quantity} Suit{quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-stone-200 pt-1.5">
                <span>Items Subtotal:</span>
                <span className="font-bold text-stone-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cargo Charge:</span>
                <span className="font-bold text-[#A27C44]">
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-[10px] text-stone-400 mt-0.5 font-normal">
                  💡 Spend <span className="font-bold">{formatPrice(5000 - subtotal)} more</span> to unlock FREE shipping!
                </p>
              )}
              <div className="flex justify-between border-t border-stone-200 pt-2 font-extrabold text-sm text-[#2C1D11] font-serif">
                <span>Total Estimated Cost:</span>
                <span>{formatPrice(totalBill)}</span>
              </div>
            </div>

            {/* BIG ORDER DIRECT TO WHATSAPP BUTTON */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-emerald-950 text-stone-100 hover:bg-[#1E1103] active:scale-95 font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all text-sm cursor-pointer"
            >
              <Send className="w-4 h-4 fill-emerald-100 text-emerald-100" />
              <span>⚡ ORDER VIA WHATSAPP (CASH ON DELIVERY)</span>
            </button>
          </form>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 text-[11px] pt-4 text-center border-t border-stone-200 font-sans">
            <div className="flex flex-col items-center">
              <Ruler className="w-4 h-4 text-amber-600 mb-1" />
              <span className="font-bold text-stone-900 leading-tight">Guaranteed 4.5 Yards</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-amber-600 mb-1" />
              <span className="font-bold text-stone-900 leading-tight">Manga Mandi Dispatch</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-amber-600 mb-1" />
              <span className="font-bold text-stone-900 leading-tight">Easy Fabric Exchange</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="border-t border-stone-200 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Write review */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xl font-serif font-black text-[#2C1D11]">Add Customer Experience</h3>
          <p className="text-stone-500 text-xs">Have you bought unstitched fabrics from Al Hamd? Write your feedback about the dye, yarn count, and starch responsiveness.</p>
          <form onSubmit={handleAddReview} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase mb-1">Your Full Name:</label>
              <input 
                type="text" 
                placeholder="Muhammad Altaf"
                value={newReview.name}
                onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase mb-2">Fabric Rating:</label>
              <div className="flex items-center gap-1.5">
                {[5, 4, 3, 2, 1].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: num })}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${newReview.rating === num ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-stone-50 text-stone-300 border-stone-200 hover:bg-stone-100'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-400 uppercase mb-1">Review Statement:</label>
              <textarea 
                rows={3}
                placeholder="Talk about transparency, shade accuracy, shrinkage, or starch-friendly response..."
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              ></textarea>
            </div>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-[#A27C44] hover:bg-[#8F6A34] hover:shadow-md text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Post Review
            </button>
          </form>
        </div>

        {/* Existing reviews */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xl font-serif font-black text-[#2C1D11]">
            Reviews from Lahore Suburbs ({reviewsList.length})
          </h3>
          {reviewsList.length === 0 ? (
            <p className="text-stone-400 text-xs italic">No reviews have been posted for this fabric yet. Be the first to share your experience!</p>
          ) : (
            <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2 text-left">
              {reviewsList.map((review, idx) => (
                <div key={review.id || idx} className="bg-stone-50 p-4 rounded-xl border border-stone-200/60 shadow-sm text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-stone-900">{review.name}</span>
                    <span className="text-[10px] text-stone-400">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.floor(review.rating) ? 'fill-amber-500 text-amber-500' : 'text-stone-200'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-stone-600 text-xs leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
