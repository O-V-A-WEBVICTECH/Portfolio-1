import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Volume2, ArrowRight } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const menuItems = [
    { label: 'Home', target: 'hero-section' },
    { label: 'Products', target: 'products-section' },
    { label: 'Custom EQ', target: 'audio-customizer' },
    { label: 'Why Crescendo?', target: 'why-crescendo' },
  ];

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-xs border-b border-slate-100/80 py-3.5' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleScrollTo('hero-section')}
            className="flex items-center gap-2.5 text-slate-900 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md shadow-blue-500/10">
              <Volume2 size={18} fill="currentColor" className="animate-pulse" />
            </div>
            <div>
              <span className="font-sans font-black text-lg tracking-tight uppercase">CRESCENDO</span>
              <p className="font-mono text-[9px] text-slate-500 font-bold -mt-1 tracking-widest uppercase">Acoustics</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleScrollTo(item.target)}
                className="text-slate-600 hover:text-blue-600 font-sans font-medium text-sm transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right Hand Tools */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Shopping Cart Trigger */}
            <button
              id="btn-nav-cart"
              onClick={onOpenCart}
              className="relative p-2.5 text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all cursor-pointer border border-slate-200/50 hover:border-blue-200"
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-rose-500/20 border-2 border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* CTA action button */}
            <button
              onClick={() => handleScrollTo('products-section')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/15"
            >
              Shop Collection
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Mobile Right Tools (Hamburger + Cart) */}
          <div className="flex md:hidden items-center gap-2">
            
            {/* Mobile Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-slate-700 bg-slate-50 rounded-xl border border-slate-200"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-700 bg-slate-50 rounded-xl border border-slate-200"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Drawer backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 z-30 backdrop-blur-xs md:hidden"
            />

            {/* Drawer contents */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="fixed inset-x-0 top-[70px] bg-white border-b border-slate-200 shadow-xl z-35 p-6 flex flex-col gap-4 md:hidden"
            >
              <div className="flex flex-col gap-3">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleScrollTo(item.target)}
                    className="w-full text-left py-3.5 px-4 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-sans font-bold text-sm transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button
                  onClick={() => handleScrollTo('products-section')}
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  Shop Collection
                  <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
