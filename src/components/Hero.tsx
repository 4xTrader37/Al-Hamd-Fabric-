import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, BadgeCheck, MessageSquare, ChevronLeft, ChevronRight, Award, Leaf, Scissors, Truck } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

const HEADER_SLIDES = [
  {
    id: 1,
    title: "Al-Hamd Fabric Premium Unstitched Suitings",
    subtitle: "Premium Fabrics, Timeless Style",
    description: "Discover the finest quality fabrics crafted for elegance, comfort, and sophistication curated directly for your wardrobe.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    categoryFilter: "ladies-3pc"
  },
  {
    id: 2,
    title: "Crisp Cotton, Latha & Royal Boski Silk Collection",
    subtitle: "Gents Imperial Suiting",
    description: "Curated Egyptian Latha and heavy 8-pound Boski silk varieties with soft drape, stiff starch-friendly finishes for traditional wear.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80",
    categoryFilter: "gents"
  },
  {
    id: 3,
    title: "Intricate Self-Textured Jacquard & Festive Karandi",
    subtitle: "Wedding & Festive Fancy Weaves",
    description: "Gilded metallic gold thread details and organic woven structures designed to look absolutely regal at key family events.",
    image: "https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=1200&q=80",
    categoryFilter: "wedding-fancy"
  }
];

export default function Hero({ onNavigate }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto scroll slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HEADER_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HEADER_SLIDES.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HEADER_SLIDES.length) % HEADER_SLIDES.length);
  };

  const currentSlideData = HEADER_SLIDES[activeSlide];

  return (
    <div className="bg-[#FAF6F0] border-b border-stone-250/20">
      <section className="relative overflow-hidden py-16 px-4 sm:px-8 md:py-20 lg:py-24 max-w-7xl mx-auto">
        {/* Decorative subtle background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(162,124,68,0.05),transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center text-left">
            
            {/* Left Side: Copywriting Content (Warm Luxury Palette) */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-[#A27C44]/10 border border-[#A27C44]/25 text-[#A27C44] text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest self-start">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premium Quality • Timeless Heritage</span>
              </div>

              <div className="min-h-[160px] sm:min-h-[190px] flex flex-col justify-center">
                <span className="text-[#A27C44] text-xs sm:text-sm font-bold uppercase tracking-widest block font-sans mb-1.5">
                  {currentSlideData.subtitle}
                </span>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.1] text-[#2C1D11]">
                  {currentSlideData.title.split(' ').map((word, i) => {
                    if (word.toLowerCase() === "unstitched" || word.toLowerCase() === "premium" || word.toLowerCase() === "latha" || word.toLowerCase() === "boski" || word.toLowerCase() === "al-hamd" || word.toLowerCase() === "fabric") {
                      return <span key={i} className="text-[#A27C44] font-serif font-bold italic">{word} </span>;
                    }
                    return word + " ";
                  })}
                </h1>
                
                <p className="text-[#5C4D3E] text-sm sm:text-base mt-4 font-normal leading-relaxed max-w-xl">
                  {currentSlideData.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onNavigate({ type: 'products', filterCategory: currentSlideData.categoryFilter })}
                  className="px-6 py-3.5 bg-[#A27C44] hover:bg-[#8F6A34] active:scale-95 text-white font-black rounded-lg shadow-md flex items-center justify-center gap-2 transition-all text-xs tracking-wider uppercase cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate({ type: 'about' })}
                  className="px-6 py-3.5 bg-transparent border-2 border-[#A27C44] text-[#A27C44] hover:bg-[#A27C44]/10 active:scale-95 font-bold rounded-lg flex items-center justify-center gap-2 transition-all text-xs tracking-wider uppercase cursor-pointer"
                >
                  <span>About Us</span>
                </button>
              </div>

              {/* Slide Navigation Pagination Dots & Arrows */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex gap-1.5">
                  {HEADER_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-6 h-1.5 rounded-full transition-all duration-350 ${activeSlide === idx ? 'bg-[#A27C44]' : 'bg-stone-300'}`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={prevSlide}
                    className="p-1.5 bg-white border border-[#A27C44]/20 hover:bg-[#FAF6F0] rounded-lg text-[#A27C44] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="p-1.5 bg-white border border-[#A27C44]/20 hover:bg-[#FAF6F0] rounded-lg text-[#A27C44] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Huge High-end Showroom Collage Frame */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#A27C44]/25 shadow-xl bg-stone-900">
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSlide}
                    src={currentSlideData.image}
                    alt={currentSlideData.subtitle}
                    className="w-full h-full object-cover select-none"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Rich gold vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1D11]/60 via-transparent to-transparent pointer-events-none" />

                {/* Direct Curation Label */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-xl border border-[#A27C44]/20 shadow-lg flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest leading-none">Traditional Quality</p>
                    <p className="text-xs font-serif font-black text-[#2C1D11] mt-1">Al Hamd Fabrics • Direct Loom Sourcing</p>
                  </div>
                  <div className="text-[9px] font-black text-[#A27C44] bg-[#A27C44]/10 px-2.5 py-1 rounded border border-[#A27C44]/20 uppercase">
                    100% Genuine
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Modern Features Grid bar EXACTLY like the storefront mockup */}
      <div className="bg-white border-y border-stone-200/60 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-stone-200/60 lg:divide-x">
          {/* Feature 1 */}
          <div className="flex items-start gap-3.5 text-left lg:px-4">
            <div className="p-3 rounded-full bg-[#FAF6F0] text-[#A27C44] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-stone-900 text-sm sm:text-base leading-tight">Premium Quality</h4>
              <p className="text-stone-500 text-xs sm:text-xs mt-1 leading-normal">Finest fabrics with superior quality you can trust.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3.5 text-left lg:px-4">
            <div className="p-3 rounded-full bg-[#FAF6F0] text-[#A27C44] shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-stone-900 text-sm sm:text-base leading-tight">Soft & Comfortable</h4>
              <p className="text-stone-500 text-xs sm:text-xs mt-1 leading-normal">Luxurious fabrics for maximum comfort.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3.5 text-left lg:px-4">
            <div className="p-3 rounded-full bg-[#FAF6F0] text-[#A27C44] shrink-0">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-stone-900 text-sm sm:text-base leading-tight">Expert Craftsmanship</h4>
              <p className="text-stone-500 text-xs sm:text-xs mt-1 leading-normal">Perfectly woven with precision and care.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-3.5 text-left lg:px-4">
            <div className="p-3 rounded-full bg-[#FAF6F0] text-[#A27C44] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-stone-900 text-sm sm:text-base leading-tight">Fast Delivery</h4>
              <p className="text-stone-500 text-xs sm:text-xs mt-1 leading-normal">Quick and reliable delivery across the country.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
