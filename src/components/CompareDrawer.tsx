import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ShoppingCart, Layers } from 'lucide-react';
import { Product } from '../types';

interface CompareDrawerProps {
  compareProducts: Product[];
  onRemoveFromCompare: (product: Product) => void;
  onClearAll: () => void;
  onAddToCart: (product: Product, color: { name: string; hex: string }) => void;
}

export default function CompareDrawer({
  compareProducts,
  onRemoveFromCompare,
  onClearAll,
  onAddToCart
}: CompareDrawerProps) {
  if (compareProducts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="compare-drawer-tray"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        className="fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 z-40 text-white shadow-2xl p-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          
          {/* Header Controls */}
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md">
                <Layers size={14} />
              </div>
              <h4 className="font-sans font-bold text-sm">
                Spec Comparison Desk ({compareProducts.length} selected)
              </h4>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-white font-mono uppercase tracking-wider"
              >
                Clear All
              </button>
              <button
                onClick={onClearAll}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Table Container - supports horizontal scrolling on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-850">
                  <th className="py-2.5 text-xs font-mono text-slate-400 font-bold uppercase tracking-wider w-1/4">Specification</th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="py-2.5 px-4 w-1/4 relative">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-sans font-bold text-xs truncate max-w-[120px]">
                          {p.name}
                        </span>
                        <button
                          onClick={() => onRemoveFromCompare(p)}
                          className="p-0.5 rounded bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove from comparison"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs font-medium">
                
                {/* Thumbnails Row */}
                <tr className="border-b border-slate-850/60">
                  <td className="py-3 text-slate-400 font-mono text-[10px] uppercase font-bold">Hardware Preview</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-800 p-1 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-mono font-bold text-slate-200">${p.price.toFixed(2)}</span>
                          <p className="text-[10px] text-emerald-400 font-bold">★ {p.rating} / 5.0</p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Acoustic Driver Row */}
                <tr className="border-b border-slate-850/60 hover:bg-slate-850/20 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-[10px] uppercase font-bold">Acoustic Driver</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="py-3 px-4 text-slate-200 leading-relaxed">
                      {p.specs.driver || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Battery Life Row */}
                <tr className="border-b border-slate-850/60 hover:bg-slate-850/20 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-[10px] uppercase font-bold">Battery Span</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="py-3 px-4 text-slate-200">
                      {p.specs.battery || 'Continuous (Wired)'}
                    </td>
                  ))}
                </tr>

                {/* Bluetooth Row */}
                <tr className="border-b border-slate-850/60 hover:bg-slate-850/20 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-[10px] uppercase font-bold">Wireless Chip</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="py-3 px-4 text-slate-200 font-mono text-[10px]">
                      {p.specs.bluetooth || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Waterproof Grade */}
                <tr className="border-b border-slate-850/60 hover:bg-slate-850/20 transition-colors">
                  <td className="py-3 text-slate-400 font-mono text-[10px] uppercase font-bold">Splashproof Rank</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="py-3 px-4 text-slate-200">
                      {p.specs.waterproof || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr>
                  <td className="py-4 text-slate-400 font-mono text-[10px] uppercase font-bold">Instant Shop</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="py-4 px-4">
                      <button
                        onClick={() => onAddToCart(p, p.colors[0])}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <ShoppingCart size={11} />
                        Add Default Color
                      </button>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
