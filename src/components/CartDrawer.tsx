import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Check, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, colorHex: string, delta: number) => void;
  onRemoveItem: (productId: string, colorHex: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'billing' | 'success'>('cart');
  
  // Billing details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15.00;
  const total = subtotal - discountAmount + shipping;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'CRESCENDO10') {
      setDiscountPercent(10);
      setPromoSuccess('Promo Applied! 10% Off Subtotal');
    } else if (code === 'VIPAUDIO') {
      setDiscountPercent(15);
      setPromoSuccess('VIP Discount Applied! 15% Off Subtotal');
    } else {
      setPromoError('Invalid coupon code. Try "CRESCENDO10"');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !cardNumber) {
      alert('Please fill out the required billing information.');
      return;
    }
    setCheckoutStep('success');
  };

  const handleCloseAndReset = () => {
    onClose();
    // Delay resetting steps slightly so the closing animation doesn't look jumpy
    setTimeout(() => {
      setCheckoutStep('cart');
      setName('');
      setEmail('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setPromoCode('');
      setDiscountPercent(0);
      setPromoSuccess('');
      setPromoError('');
    }, 300);
  };

  const handleResetCheckout = () => {
    onClearCart();
    handleCloseAndReset();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAndReset}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            id="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white text-slate-900 z-50 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-55">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="font-sans font-bold text-lg text-slate-900">
                  {checkoutStep === 'cart' && `Shopping Cart (${cartItems.length})`}
                  {checkoutStep === 'billing' && 'Secure Checkout'}
                  {checkoutStep === 'success' && 'Order Confirmed!'}
                </h3>
              </div>
              <button
                id="btn-close-cart"
                onClick={handleCloseAndReset}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* STEP 1: CART DISPLAY */}
              {checkoutStep === 'cart' && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center py-10">
                      <ShoppingBag size={48} className="text-slate-300 mb-4 stroke-1 animate-bounce" />
                      <h4 className="font-sans font-bold text-slate-700 text-base mb-1">Your cart is empty</h4>
                      <p className="text-slate-400 text-xs max-w-[240px] mb-6">
                        Explore our premium acoustic collection and select an audio companion.
                      </p>
                      <button
                        onClick={onClose}
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all shadow-md"
                      >
                        Start Browsing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Shipping progress indicator */}
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/60 text-xs">
                        {subtotal >= 200 ? (
                          <div className="flex items-center gap-2 text-blue-700 font-medium">
                            <Check size={14} className="stroke-[3px]" />
                            <span>Your order qualifies for <strong>Free Worldwide Shipping!</strong></span>
                          </div>
                        ) : (
                          <div className="text-slate-600">
                            Add <strong className="text-slate-900">${(200 - subtotal).toFixed(2)}</strong> more for <strong className="text-slate-900">Free Shipping</strong>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                              <div 
                                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${(subtotal / 200) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items list */}
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div 
                            key={`${item.product.id}-${item.selectedColor.hex}`}
                            className="flex items-start gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200/50 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-sans font-semibold text-xs text-slate-900 truncate">
                                  {item.product.name}
                                </h4>
                                <button
                                  onClick={() => onRemoveItem(item.product.id, item.selectedColor.hex)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <div className="flex items-center gap-2 mt-1">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full border border-slate-300"
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                  title={item.selectedColor.name}
                                />
                                <span className="text-[10px] font-mono text-slate-500">
                                  {item.selectedColor.name}
                                </span>
                              </div>

                              <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.selectedColor.hex, -1)}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="px-2.5 text-xs font-mono font-bold text-slate-800">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.selectedColor.hex, 1)}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-900">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Promo Code Input */}
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Coupon code (e.g. CRESCENDO10)"
                              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500 uppercase font-mono"
                            />
                          </div>
                          <button
                            onClick={handleApplyPromo}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && (
                          <p className="text-[10px] text-rose-600 mt-1.5 font-medium pl-1">{promoError}</p>
                        )}
                        {promoSuccess && (
                          <p className="text-[10px] text-emerald-600 mt-1.5 font-medium pl-1 flex items-center gap-1">
                            <Check size={12} className="stroke-[3px]" /> {promoSuccess}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: BILLING FORM */}
              {checkoutStep === 'billing' && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <ShieldCheck size={16} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Secure Payment Gateway</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
                      <CreditCard size={12} />
                      <span>Credit Card Number</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">CVV Security</label>
                      <input
                        type="password"
                        required
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-400 mt-6 leading-relaxed">
                    By confirming this order, you are authorizing a secure test transaction of <strong>${total.toFixed(2)}</strong>. Goods will be dispatched to your billing address within 2-4 business days.
                  </div>
                </form>
              )}

              {/* STEP 3: ORDER SUCCESS RECEIPT */}
              {checkoutStep === 'success' && (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-scale-in">
                    <Check size={32} className="stroke-[3px]" />
                  </div>
                  <h4 className="font-sans font-bold text-slate-800 text-lg mb-1">Receipt Printed!</h4>
                  <p className="text-slate-400 text-xs mb-6 max-w-xs">
                    Your payment of <strong>${total.toFixed(2)}</strong> was processed successfully. A confirmation slip has been sent to <span className="text-slate-700 font-medium">{email}</span>.
                  </p>

                  {/* Digital Invoice Box */}
                  <div className="w-full bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left font-mono text-[11px] text-slate-600 space-y-3.5 shadow-sm max-w-sm">
                    <div className="border-b border-dashed border-slate-200 pb-2 flex justify-between text-slate-400 font-bold">
                      <span>INVOICE: #CRES-{(Math.floor(Math.random() * 8999) + 1000)}</span>
                      <span>DATE: 2026-07-01</span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">SHIPPED TO:</div>
                      <div>{name}</div>
                      <div>{email}</div>
                    </div>

                    <div className="border-b border-dashed border-slate-200 pb-2 space-y-1">
                      <div className="font-bold text-slate-800">ITEMS SUMMARY:</div>
                      {cartItems.map((item) => (
                        <div key={`${item.product.id}-${item.selectedColor.hex}`} className="flex justify-between">
                          <span className="truncate max-w-[200px]">{item.product.name} ({item.selectedColor.name}) x{item.quantity}</span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 text-right">
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>COUPON APPLIED:</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>SHIPPING FEE:</span>
                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold text-[13px] border-t border-slate-200 pt-2">
                        <span>TOTAL CHARGED:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleResetCheckout}
                    className="w-full mt-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
                  >
                    Done & Return to Store
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary (Not shown in success screen) */}
            {checkoutStep !== 'success' && cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="space-y-1.5 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900 font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span className="flex items-center gap-1"><Tag size={12} /> Promo Discount</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-900 font-bold pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="font-mono text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    id="btn-goto-billing"
                    onClick={() => setCheckoutStep('billing')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    Proceed to Checkout
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    id="btn-confirm-checkout"
                    onClick={handleCheckoutSubmit}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all animate-pulse"
                  >
                    Authorize & Secure Pay
                    <Check size={14} className="stroke-[3px]" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
