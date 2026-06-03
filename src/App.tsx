/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Sparkles, ShoppingBag, Eye, Heart } from 'lucide-react';

// Data & Types
import { PRODUCTS } from './data';
import { Product, FabricOption, CartItem } from './types';

// Premium Modular Components
import Header from './components/Header';
import HeroProductDetail from './components/HeroProductDetail';
import TechnicalSpecs from './components/TechnicalSpecs';
import CompleteLook from './components/CompleteLook';
import CartDrawer from './components/CartDrawer';
import VirtualConcierge from './components/VirtualConcierge';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

export default function App() {
  // Navigation categories and visual filter state
  const [currentCategory, setCurrentCategory] = useState<string>('All Collections');
  
  // Selection showcase anchor (defaulting to iconic Velvet Serenity Sofa)
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    PRODUCTS.find((p) => p.id === 'velvet-serenity-sofa') || PRODUCTS[0]
  );

  // Cart list
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Interface visibility drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  // Favorites/Wishlist to enrich user experience
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filtered catalogue listing
  const filteredProducts = currentCategory === 'All Collections'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === currentCategory);

  // Callback to select other furniture
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // Smooth transition scroll up to the master configuration zone
    const targetElement = document.getElementById('details-showcase-panel');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add configuration option to shopping cart list
  const handleAddToCart = (product: Product, fabric?: FabricOption) => {
    // Unique ID combining product and chosen fabric color
    const uniqueId = fabric ? `${product.id}-${fabric.id}` : product.id;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === uniqueId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === uniqueId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { id: uniqueId, product, selectedFabric: fabric, quantity: 1 }];
    });

    // Elegant auto opening of cart drawer after a tiny delay
    setTimeout(() => {
      setIsCartOpen(true);
    }, 800);
  };

  // Cart quantity adjustments
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Select a product by ID from the cart back to the showcase
  const handleSelectProductFromCart = (productId: string) => {
    const found = PRODUCTS.find((p) => p.id === productId);
    if (found) {
      handleSelectProduct(found);
    }
  };

  // Toggle favorite list
  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId) 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId]
    );
  };

  // Initial top window centering scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-beige text-brand-charcoal overflow-x-hidden selection:bg-brand-gold/10 selection:text-brand-gold antialiased">
      
      {/* 1. Global Navigation Frame */}
      <Header
        currentCategory={currentCategory}
        onSetCategory={setCurrentCategory}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onOpenConcierge={() => setIsConciergeOpen(!isConciergeOpen)}
        isConciergeActive={isConciergeOpen}
      />

      <main className="pt-32 pb-20 px-6 md:px-20 max-w-[1440px] mx-auto">
        
        {/* 2. Panoramic Curated Banner Intro */}
        <header className="mb-20 space-y-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.2, 0, 0.2, 1] }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold">
              <span>Atelier d'Intérieurs</span>
              <span className="h-[1px] w-8 bg-brand-gold/50" />
              <span>Quiet Luxury 2026</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl text-brand-charcoal font-light leading-[1.1] tracking-tight">
              Pour des intérieurs qui respirent le calme.
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="font-sans text-brand-charcoal-light text-base md:text-lg leading-relaxed font-light max-w-2xl"
          >
            AURA allie pureté architecturale et harmonie sensorielle des matières. Nous collaborons avec des ateliers familiaux d'élite en Toscane et à Munich pour insuffler un calme absolu et une élégance intemporelle à votre lieu de vie.
          </motion.p>
        </header>

        {/* 3. Master Interactive Configuration Showcase details page anchor */}
        <div id="details-showcase-panel" className="scroll-mt-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
            >
              <HeroProductDetail 
                product={selectedProduct} 
                onAddToCart={handleAddToCart}
              />
              
              <TechnicalSpecs 
                product={selectedProduct} 
              />
              
              <CompleteLook 
                currentProduct={selectedProduct}
                allProducts={PRODUCTS}
                onSelectProduct={handleSelectProduct}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 4. Complete Browse Catalogue collection Grid */}
        <section className="mt-40 border-t border-brand-container-high/60 pt-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <p className="font-sans text-[11px] font-bold text-brand-gold tracking-widest uppercase">DÉCOUVRIR NOS COLLECTIONS</p>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal mt-2 tracking-tight">Le Catalogue de Créateurs</h2>
            </div>

            {/* Quick category filters */}
            <div className="flex flex-wrap gap-2.5">
              {['All Collections', 'Living Room', 'Bedroom', 'Dining', 'Office'].map((cat) => {
                const categoryTranslations: Record<string, string> = {
                  'All Collections': 'Tous',
                  'Living Room': 'Salon',
                  'Bedroom': 'Chambre',
                  'Dining': 'Salle à Manger',
                  'Office': 'Bureau'
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setCurrentCategory(cat)}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 rounded-sm cursor-pointer border ${
                      currentCategory === cat 
                        ? 'bg-brand-charcoal text-brand-beige border-brand-charcoal' 
                        : 'bg-brand-lowest hover:bg-brand-low text-brand-charcoal border-brand-container-high/60'
                    }`}
                  >
                    {categoryTranslations[cat] || cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product grid bento list representation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((item) => {
              const isActiveShowcase = selectedProduct.id === item.id;
              const isLiked = favorites.includes(item.id);
              
              return (
                <div 
                  key={item.id}
                  onClick={() => handleSelectProduct(item)}
                  className={`bg-brand-lowest border rounded-sm p-4 group cursor-pointer hover:shadow-md transition-all duration-700 ease-out flex flex-col ${
                    isActiveShowcase ? 'border-brand-gold shadow-sm ring-1 ring-brand-gold' : 'border-brand-container-high/40'
                  }`}
                >
                  {/* Photo with absolute actions */}
                  <div className="aspect-[3/4] overflow-hidden bg-brand-low relative rounded-sm">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102"
                    />

                    {/* Quick view overlay icons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`p-2 bg-brand-container rounded-full shadow-xs hover:text-brand-gold transition cursor-pointer border border-white/5 ${
                          isLiked ? 'text-brand-gold' : 'text-brand-charcoal'
                        }`}
                        title="Favoris"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Indicator if active in showcase */}
                    {isActiveShowcase && (
                      <div className="absolute bottom-3 left-3 bg-brand-gold text-white text-[9px] uppercase tracking-wider font-semibold py-1 px-2.5 rounded-sm shadow-xs animate-pulse">
                        En Configuration active
                      </div>
                    )}
                  </div>

                  {/* Descriptions details details */}
                  <div className="pt-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-sans text-[10px] tracking-widest uppercase font-semibold text-brand-gold">{item.subCategory}</p>
                      <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal mt-1 group-hover:text-brand-gold transition">
                        {item.name}
                      </h3>
                      <p className="font-sans text-xs text-brand-charcoal-light/80 mt-2 font-light line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-6 mt-4 border-t border-brand-container/40">
                      <span className="font-serif text-sm font-semibold">{item.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                      <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-brand-charcoal group-hover:text-brand-gold transition flex items-center gap-1.5 leading-none">
                        Personnaliser
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Concierge floating callout banner */}
        <section className="mt-32 p-8 md:p-14 rounded-sm bg-brand-charcoal text-brand-beige flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute right-0 bottom-0 top-0 w-2/5 origin-bottom bg-gradient-to-l from-brand-gold/10 pointer-events-none" />
          
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold rounded-full text-[10px] uppercase tracking-widest font-semibold text-white">
              <Sparkles className="w-3 h-3 animate-spin" />
              Intelligence &amp; Conseils
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-brand-beige tracking-tight font-light">
              Des doutes sur les mesures ou l'accord des tissus ?
            </h3>
            <p className="font-sans text-xs md:text-sm text-brand-beige/70 leading-relaxed font-light">
              Chattez en temps réel avec notre directeur styliste virtuel alimenté par l'intelligence d’Atelier Aura. Demandez-lui d'accorder des matériaux, de planifier votre pièce ou de vous proposer des palettes.
            </p>
          </div>

          <button
            onClick={() => setIsConciergeOpen(true)}
            className="px-8 py-4 bg-brand-gold hover:bg-white hover:text-brand-charcoal text-white text-xs uppercase tracking-widest font-semibold transition-all duration-500 flex items-center gap-3 shadow-lg z-10 cursor-pointer"
          >
            Démarrer le Concierge AI
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </section>

        {/* 6. Newsletter Block */}
        <Newsletter />

      </main>

      {/* 7. Corporate footer info */}
      <Footer onSetCategory={setCurrentCategory} />

      {/* 8. Sliders side panel overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSelectProduct={handleSelectProductFromCart}
      />

      <VirtualConcierge
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        allProducts={PRODUCTS}
        onSelectProduct={handleSelectProduct}
        onAddToCart={(product) => handleAddToCart(product)}
      />

    </div>
  );
}
