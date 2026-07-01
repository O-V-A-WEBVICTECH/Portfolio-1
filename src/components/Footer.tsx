import React, { useState } from 'react';
import { Volume2, Mail, Check, Github, Twitter, Youtube, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer id="crescendo-footer" className="bg-slate-950 text-white pt-20 pb-10 px-4 md:px-8 border-t border-slate-900 relative overflow-hidden">
      
      {/* Visual top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 pb-16 border-b border-slate-900">
        
        {/* Brand Block (4/12 cols) */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Volume2 size={16} fill="currentColor" />
            </div>
            <span className="font-sans font-black text-lg tracking-tight uppercase">CRESCENDO</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Pioneering premium dual-chamber acoustics and intelligent wave equalization. Crafting the world's finest personal soundscapes for studio engineers, world runners, and daily audiophiles alike.
          </p>
          <div className="flex items-center gap-3.5 pt-2">
            <a href="#" className="p-2 bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all" title="Twitter">
              <Twitter size={15} />
            </a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all" title="YouTube">
              <Youtube size={15} />
            </a>
            <a href="#" className="p-2 bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all" title="GitHub">
              <Github size={15} />
            </a>
          </div>
        </div>

        {/* Quick Links Block (4/12 cols) */}
        <div className="md:col-span-4 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-4">
            <h4 className="font-mono font-bold text-slate-200 uppercase tracking-widest text-[10px]">ACOUSTIC GEAR</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Over-Ear Headsets</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Active ANC Earbuds</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Spatial Speakers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Power Accessories</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-mono font-bold text-slate-200 uppercase tracking-widest text-[10px]">COMPANY</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Acoustic Patents</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Find a Store</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sustainably Sourced</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">2-Year Warranty</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter subscription Block (4/12 cols) */}
        <div className="md:col-span-4 space-y-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-900">
          <h4 className="font-sans font-bold text-sm text-slate-100">Join the Crescendo Circle</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Sign up to receive firmware update notifications, audio acoustics research articles, and exclusive VIP launch invitations.
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-2.5">
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full pl-9 pr-12 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                title="Subscribe"
              >
                <Send size={12} />
              </button>
            </div>
            
            {subscribed && (
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <Check size={12} className="stroke-[3px]" />
                Subscription verified! Check your inbox.
              </p>
            )}
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
        <span>© 2026 CRESCENDO ACOUSTICS CO. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Firmware End User License</a>
        </div>
      </div>

    </footer>
  );
}
