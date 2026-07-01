import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Shield, Battery, Radio, Check, Layers, ChevronDown, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product, selectedColor: { name: string; hex: string }) => void;
  isComparing: boolean;
  onCompareToggle: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  isComparing,
  onCompareToggle
}: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedColor);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
    >
      
      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.badge && (
          <span className="bg-slate-900 text-white font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Image Section */}
      <div className="bg-slate-50/50 p-6 relative aspect-square overflow-hidden flex items-center justify-center border-b border-slate-100/50">
        
        {/* Subtle radial glow behind product */}
        <div className="absolute w-40 h-40 bg-blue-100/35 rounded-full filter blur-2xl group-hover:scale-125 transition-transform duration-500" />
        
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full max-h-[190px] object-contain object-center z-10 transform group-hover:scale-105 transition-transform duration-500 select-none"
          referrerPolicy="no-referrer"
        />

        {/* Compare specs checkbox overlay */}
        <div className="absolute top-4 right-4 z-10">
          <label className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors cursor-pointer text-[10px] font-bold text-slate-600 select-none">
            <input
              type="checkbox"
              checked={isComparing}
              onChange={() => onCompareToggle(product)}
              className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer h-3.5 w-3.5"
            />
            Compare Spec
          </label>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          {/* Category Tag & Ratings */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-[9px] text-slate-400 uppercase font-black tracking-widest">{product.category}</span>
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="font-mono text-[10px] font-bold text-slate-700">{product.rating}</span>
              <span className="text-slate-400 font-medium text-[9px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name & Price */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-sans font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <span className="font-mono font-black text-sm text-slate-900 shrink-0">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Core Short Description */}
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Swatches & Interactivity */}
        <div className="space-y-4 pt-2">
          
          {/* Swatches selector */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-3">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Color Profile</span>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => {
                const active = selectedColor.hex === color.hex;
                return (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      active ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {active && <Check size={11} className="text-white stroke-[3px]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specs Expandable Accordion */}
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
            <button
              onClick={() => setIsSpecsOpen(!isSpecsOpen)}
              className="w-full flex justify-between items-center p-3 text-[11px] font-mono font-bold text-slate-600 hover:bg-slate-100/50 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Layers size={12} className="text-blue-500" />
                TECHNICAL DETAILS
              </span>
              <ChevronDown 
                size={13} 
                className={`transition-transform duration-300 ${isSpecsOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {isSpecsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-2 text-[10px] text-slate-500 bg-white"
                >
                  {product.specs.driver && (
                    <div className="flex justify-between">
                      <span className="font-bold">Acoustic Driver:</span>
                      <span className="text-slate-800 text-right truncate max-w-[150px]">{product.specs.driver}</span>
                    </div>
                  )}
                  {product.specs.battery && (
                    <div className="flex justify-between">
                      <span className="font-bold">Battery Life:</span>
                      <span className="text-slate-800 text-right">{product.specs.battery}</span>
                    </div>
                  )}
                  {product.specs.bluetooth && (
                    <div className="flex justify-between">
                      <span className="font-bold">Connectivity:</span>
                      <span className="text-slate-800 text-right">{product.specs.bluetooth}</span>
                    </div>
                  )}
                  {product.specs.waterproof && (
                    <div className="flex justify-between">
                      <span className="font-bold">Waterproof Grade:</span>
                      <span className="text-slate-800 text-right">{product.specs.waterproof}</span>
                    </div>
                  )}
                  {product.specs.power && (
                    <div className="flex justify-between">
                      <span className="font-bold">Power Capacity:</span>
                      <span className="text-slate-800 text-right">{product.specs.power}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button: Add to Cart */}
          <button
            id={`btn-add-to-cart-${product.id}`}
            onClick={handleAdd}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              addedFeedback 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-100 shadow-md hover:shadow-lg'
            }`}
          >
            {addedFeedback ? (
              <>
                <Check size={14} className="stroke-[3px]" />
                Added Companion!
              </>
            ) : (
              <>
                <ShoppingCart size={13} />
                Add to Cart
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
