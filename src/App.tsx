import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  MapPin, 
  Shield, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Star, 
  Plus, 
  ThumbsUp,
  Sliders
} from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AudioEQCustomizer from './components/AudioEQCustomizer';
import CompareDrawer from './components/CompareDrawer';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

import { PRODUCTS, REVIEWS } from './data';
import { Product, CartItem, Review } from './types';

export default function App() {
  // Navigation & Scroll
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  
  // Catalog filter states
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'speakers' | 'headphones' | 'earbuds' | 'accessories'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Reviews State
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Scroll logic
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add item to cart
  const handleAddToCart = (product: Product, selectedColor: { name: string; hex: string }) => {
    setCart((prevCart) => {
      // Check if product with this exact color is already in cart
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor.hex === selectedColor.hex
      );

      if (existingIdx > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIdx] = {
          ...nextCart[existingIdx],
          quantity: nextCart[existingIdx].quantity + 1,
        };
        return nextCart;
      } else {
        return [...prevCart, { product, selectedColor, quantity: 1 }];
      }
    });
  };

  // Update quantity inside cart
  const handleUpdateCartQuantity = (productId: string, colorHex: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedColor.hex === colorHex) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  // Remove individual item from cart
  const handleRemoveFromCart = (productId: string, colorHex: string) => {
    setCart((prevCart) => {
      return prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedColor.hex === colorHex)
      );
    });
  };

  // Clear cart completely
  const handleClearCart = () => {
    setCart([]);
  };

  // Compare toggles
  const handleCompareToggle = (product: Product) => {
    setCompareProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 products at a time.');
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromCompare = (product: Product) => {
    setCompareProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const handleClearCompareAll = () => {
    setCompareProducts([]);
  };

  // Category view clicks (sets category and scrolls to products catalog)
  const handleCategoryClick = (category: 'speakers' | 'headphones' | 'earbuds' | 'accessories') => {
    setSelectedCategory(category);
    handleScrollToSection('products-section');
  };

  // Submit dynamic review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;

    const newRev: Review = {
      id: `rev-custom-${Date.now()}`,
      userName: newReviewName,
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewComment,
      verified: true
    };

    setReviews([newRev, ...reviews]);
    setNewReviewName('');
    setNewReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 5000);
  };

  // Filter products based on search query and category
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Floating Header Navbar */}
      <Navbar 
        cartCount={cartTotalCount} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* Hero Showcase Block */}
      <Hero 
        onShopClick={() => handleScrollToSection('products-section')} 
        onEQClick={() => handleScrollToSection('audio-customizer')}
      />

      {/* Category Swiper Block ("Shop By Category") */}
      <section id="category-swiper-section" className="py-16 px-4 md:px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex justify-between items-end">
            <div className="space-y-1 text-left">
              <span className="font-mono text-[9px] text-blue-600 uppercase font-black tracking-widest">Acoustic Collections</span>
              <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-tight text-slate-900">
                Shop By Category
              </h2>
            </div>
            {/* Carousel navigation controls (Static decoration for aesthetic precision) */}
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors">
                <ArrowLeft size={16} />
              </button>
              <button className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Symmetrical Category Columns (Speaker, Accessories, Wireless Charger) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Speakers Category card */}
            <div className="bg-slate-50/55 rounded-[1.75rem] p-8 flex flex-col justify-between border border-slate-100 hover:border-blue-200/50 hover:bg-white transition-all duration-300 shadow-xs hover:shadow-lg group">
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Speaker
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Morbi justo sem, venenatis sit amet tortor id, porttitor facilisis metus. Ut scelerisque.
                </p>
                <button
                  onClick={() => handleCategoryClick('speakers')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 font-mono tracking-wider cursor-pointer select-none"
                >
                  VIEW SPEAKERS
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="mt-8 flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=400&auto=format&fit=crop"
                  alt="Desktop Wireless Speaker"
                  className="h-32 object-contain filter drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Accessories Category Card */}
            <div className="bg-slate-50/55 rounded-[1.75rem] p-8 flex flex-col justify-between border border-slate-100 hover:border-blue-200/50 hover:bg-white transition-all duration-300 shadow-xs hover:shadow-lg group">
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Accessories
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Morbi justo sem, venenatis sit amet tortor id, porttitor facilisis metus. Ut scelerisque.
                </p>
                <button
                  onClick={() => handleCategoryClick('accessories')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 font-mono tracking-wider cursor-pointer select-none"
                >
                  VIEW ACCESSORIES
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="mt-8 flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=400&auto=format&fit=crop"
                  alt="GaN Tech Wall Charger Adapter"
                  className="h-32 object-contain filter drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Wireless Charger Card */}
            <div className="bg-slate-50/55 rounded-[1.75rem] p-8 flex flex-col justify-between border border-slate-100 hover:border-blue-200/50 hover:bg-white transition-all duration-300 shadow-xs hover:shadow-lg group">
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Wireless Charger
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Morbi justo sem, venenatis sit amet tortor id, porttitor facilisis metus. Ut scelerisque.
                </p>
                <button
                  onClick={() => handleCategoryClick('accessories')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 font-mono tracking-wider cursor-pointer select-none"
                >
                  VIEW ACCESORIES
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="mt-8 flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=400&auto=format&fit=crop"
                  alt="Qi Charging Pad"
                  className="h-32 object-contain filter drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Core Products Catalog Section */}
      <section id="products-section" className="py-16 px-4 md:px-8 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Title with Counts */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="font-mono text-[9px] text-blue-600 uppercase font-black tracking-widest">CRESCENDO SPECIFICATIONS</span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-slate-900">
                Featured Products
              </h2>
            </div>
            
            {/* Search Filter Controls */}
            <div className="relative w-full md:max-w-xs">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search earbuds, speakers, specs..."
                className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-medium shadow-2xs"
              />
            </div>
          </div>

          {/* Filtering Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'earbuds', label: 'Active Earbuds' },
              { id: 'headphones', label: 'Over-Ear Headphones' },
              { id: 'speakers', label: 'Spatial Speakers' },
              { id: 'accessories', label: 'System Accessories' }
            ].map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-4.5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Filtering Stats */}
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>SHOWING {filteredProducts.length} OF {PRODUCTS.length} ITEMS</span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-blue-600 hover:underline font-bold"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  isComparing={compareProducts.some((item) => item.id === p.id)}
                  onCompareToggle={handleCompareToggle}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-xs">
              <span className="text-lg font-bold text-slate-700 block mb-2">No audio gear found</span>
              <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
                We couldn't match your search terms with our standard acoustics list. Try typing "Y168A", "charger" or "earbud".
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Reset Search
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Interactive Web Audio Equalizer Workspace */}
      <AudioEQCustomizer />

      {/* Streamlined Shopping Features Panel */}
      <section id="shopping-guarantee" className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="bg-gradient-to-br from-blue-50/50 via-slate-50 to-indigo-50/50 rounded-3xl border border-blue-100/40 p-8 md:p-14 shadow-lg text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-400/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3.5 max-w-2xl mx-auto">
              <span className="font-mono text-[9px] text-blue-600 uppercase font-black tracking-widest">WORLD-CLASS LOGISTICS</span>
              <h2 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-slate-900">
                Experience Streamlined <br className="hidden sm:block" /> Shopping With Crescendo
              </h2>
            </div>

            {/* Symmetrical 3 Columns features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-left pt-4 max-w-5xl mx-auto">
              
              {/* Free Delivery */}
              <div className="space-y-4">
                <div className="w-11 h-11 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Truck size={20} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-sans font-bold text-sm text-slate-900">Free Delivery</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean hendrerit purus quis quam, dispatched on the same business day worldwide.
                  </p>
                </div>
              </div>

              {/* Self Pickup */}
              <div className="space-y-4">
                <div className="w-11 h-11 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-sans font-bold text-sm text-slate-900">Self Pickup</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Etiam vitae ornare nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra. Pick up directly in 45 signature airport hubs.
                  </p>
                </div>
              </div>

              {/* Warranty */}
              <div className="space-y-4">
                <div className="w-11 h-11 bg-white rounded-xl border border-slate-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
                  <Shield size={20} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-sans font-bold text-sm text-slate-900">Warranty</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Donec vehicula et nulla vel fringilla. Proin interdum velit quam, ut iaculis ipsum tempor erat. Full 2-year acoustic swap warranty.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-4">
              <button
                onClick={() => handleScrollToSection('products-section')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                Shop Now
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Symmetrical Layout "Why Crescendo?" Block */}
      <section id="why-crescendo" className="py-16 px-4 md:px-8 bg-slate-50 border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-mono text-[9px] text-blue-600 uppercase font-black tracking-widest text-center">SOUND ARCHITECTURE</span>
            <h2 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-slate-900">
              Why Crescendo?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 max-w-5xl mx-auto">
            
            {/* Left Column Bullet Points (4/12 cols) */}
            <div className="lg:col-span-4 space-y-10 text-left">
              
              {/* Exceptional Quality */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-blue-600">
                  <span className="font-mono text-xs text-blue-600 font-black">▷</span>
                  <h4 className="font-sans font-bold text-sm text-slate-900">Exceptional Quality</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent varius commodo aliquam. Built on military-grade dual beryllium membranes.
                </p>
              </div>

              {/* Versatile User-Friendly */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-blue-600">
                  <span className="font-mono text-xs text-blue-600 font-black">▷</span>
                  <h4 className="font-sans font-bold text-sm text-slate-900">Versatile User-Friendly</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Maecenas eu dui dictum, imperdiet metus et, dapibus nisl. Integer sit amet augue magna. Touch swipe adjustments on high-density ceramic plates.
                </p>
              </div>

            </div>

            {/* Center Core Product Image (4/12 cols) */}
            <div className="lg:col-span-4 flex justify-center relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-blue-100/30 flex items-center justify-center border border-slate-200">
                
                {/* Decorative pulse ring */}
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-blue-200 animate-spin duration-10000 opacity-60" />
                
                <img
                  src={PRODUCTS[0].image} // Obsidian Earbuds Y168A
                  alt="Obsidian Earbud Detail Close-up"
                  className="w-48 h-48 md:w-56 md:h-56 object-contain z-10 transform hover:scale-110 transition-transform duration-500 select-none filter drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Column Bullet Points (4/12 cols) */}
            <div className="lg:col-span-4 space-y-10 text-left">
              
              {/* Innovative Design */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-blue-600">
                  <span className="font-mono text-xs text-blue-600 font-black">▷</span>
                  <h4 className="font-sans font-bold text-sm text-slate-900">Innovative Design</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Mauris laoreet congue ipsum at ultricies. Phasellus mattis dictum neque, vel sagittis odio pellentesque. Crafted in cooperation with Swiss industrial designers.
                </p>
              </div>

              {/* Superior Durability */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-blue-600">
                  <span className="font-mono text-xs text-blue-600 font-black">▷</span>
                  <h4 className="font-sans font-bold text-sm text-slate-900">Superior Durability</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Aliquam vel augue sed justo sagittis lobortis. Vestibulum porttitor sit amet magna id elementum. Rated for extreme sub-zero temperatures and high-pressure salt spray.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Verified Reviews Section & Writing Review Box */}
      <section id="reviews-section" className="py-16 px-4 md:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Reviews Listing (7/12 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-1 text-left">
              <span className="font-mono text-[9px] text-blue-600 uppercase font-black tracking-widest">ACOUSTIC CIRCLE VERIFIED FEEDBACK</span>
              <h3 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-900">
                Verified Customer Reviews
              </h3>
            </div>

            {/* Customer review list */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-sans font-bold text-sm text-slate-800">{rev.userName}</h5>
                      <span className="font-mono text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star 
                          key={idx} 
                          size={11} 
                          className={idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/40 text-[10px] font-mono">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Shield size={10} className="fill-emerald-100" /> VERIFIED PURCHASE
                    </span>
                    <button className="text-slate-400 hover:text-blue-600 flex items-center gap-1">
                      <ThumbsUp size={10} /> Helpful (2)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Write a Review Form (5/12 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-150 shadow-sm space-y-6">
            <div className="space-y-1.5 text-left">
              <h4 className="font-sans font-bold text-lg text-slate-900">Share Your Acoustics Feedback</h4>
              <p className="text-slate-500 text-xs">Help fellow audiophiles discover the right Crescendo companion.</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-600">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="e.g. Richard Feynman"
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Star selector */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-medium text-slate-600 block">Rating Score</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      type="button"
                      key={score}
                      onClick={() => setNewReviewRating(score)}
                      className="p-1 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star 
                        size={20} 
                        className={score <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-600">Acoustic Experience</label>
                <textarea
                  required
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Describe your thoughts on driver separation, bass punch, or bluetooth pairing speed..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                id="btn-submit-review"
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                Submit Verified Review
              </button>

              {reviewSuccess && (
                <p className="text-[10px] text-emerald-600 font-medium text-center bg-emerald-50 border border-emerald-100 p-2 rounded-lg animate-pulse">
                  ✓ Review submitted! It has been compiled into the community feed below.
                </p>
              )}

            </form>
          </div>

        </div>
      </section>

      {/* Elegant Footer Block */}
      <Footer />

      {/* Compare Specs Slider Drawer Component */}
      <CompareDrawer
        compareProducts={compareProducts}
        onRemoveFromCompare={handleRemoveFromCompare}
        onClearAll={handleClearCompareAll}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Slide-over Overlay Drawer Component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

    </div>
  );
}
