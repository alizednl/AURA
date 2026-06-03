import React from 'react';
import { Search, ShoppingBag, User, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentCategory: string;
  onSetCategory: (cat: string) => void;
  cartCount: number;
  onToggleCart: () => void;
  onOpenConcierge: () => void;
  isConciergeActive: boolean;
}

export default function Header({
  currentCategory,
  onSetCategory,
  cartCount,
  onToggleCart,
  onOpenConcierge,
  isConciergeActive
}: HeaderProps) {
  const categories = ['All Collections', 'Living Room', 'Bedroom', 'Dining', 'Office'];
  
  const categoryTranslations: Record<string, string> = {
    'All Collections': 'Catalogue',
    'Living Room': 'Salon',
    'Bedroom': 'Chambre',
    'Dining': 'Salle à manger',
    'Office': 'Bureau'
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-beige/80 backdrop-blur-md border-b border-brand-container-high/40 transition-luxury">
      <div className="flex justify-between items-center px-6 md:px-20 max-w-[1440px] mx-auto h-20">
        
        {/* Left: Branding & Category Menu */}
        <div className="flex items-center gap-12">
          <button 
            type="button"
            onClick={() => onSetCategory('All Collections')}
            className="font-serif text-3xl md:text-4xl tracking-tighter text-brand-charcoal hover:opacity-80 transition cursor-pointer"
          >
            AURA
          </button>
          
          <div className="hidden lg:flex items-center gap-8">
            {categories.map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSetCategory(cat)}
                  className={`font-sans text-xs uppercase tracking-widest font-semibold hover:text-brand-charcoal transition-colors duration-300 py-2 cursor-pointer ${
                    isActive 
                      ? 'text-brand-charcoal border-b border-brand-charcoal' 
                      : 'text-brand-charcoal-light/70'
                  }`}
                >
                  {categoryTranslations[cat] || cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Premium Navigation utilities */}
        <div className="flex items-center gap-6 text-brand-charcoal">
          
          {/* Virtual Concierge AI button */}
          <button
            onClick={onOpenConcierge}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 border ${
              isConciergeActive 
                ? 'bg-brand-charcoal text-brand-beige border-brand-charcoal'
                : 'hover:bg-brand-charcoal hover:text-brand-beige border-brand-charcoal/30'
            }`}
            title="AURA Art Interior Concierge"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Concierge AI</span>
          </button>

          {/* Search Trigger */}
          <button className="hover:opacity-60 transition duration-300 cursor-pointer p-1" title="Recherche">
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Shopping Cart button with counter badge */}
          <button 
            onClick={onToggleCart}
            className="relative hover:opacity-60 transition duration-300 cursor-pointer p-1" 
            title="Panier"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-bold text-white tracking-widest animate-fade-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile link */}
          <button className="hover:opacity-60 transition duration-300 cursor-pointer p-1" title="Compte">
            <User className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </nav>
  );
}
