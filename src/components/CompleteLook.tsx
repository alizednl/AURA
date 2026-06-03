import React from 'react';
import { Product } from '../types';

interface CompleteLookProps {
  currentProduct: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function CompleteLook({
  currentProduct,
  allProducts,
  onSelectProduct
}: CompleteLookProps) {
  // Filter out the active showing item, and recommend 3 styling accessories
  const recommendations = allProducts
    .filter((p) => p.id !== currentProduct.id)
    .slice(0, 3);

  return (
    <section className="mt-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
        <div>
          <h2 className="font-serif text-3xl text-brand-charcoal tracking-tight">Compléter l'Ensemble</h2>
          <p className="font-sans text-xs md:text-sm text-brand-charcoal-light/70 mt-1 font-light">
            Une sélection recommandée par nos directeurs artistiques.
          </p>
        </div>
        <button 
          type="button" 
          onClick={() => {
            // Scroll back to top for lookbook browsing
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-sans text-[11px] font-semibold text-brand-charcoal border-b border-brand-charcoal pb-1 uppercase tracking-widest hover:text-brand-gold hover:border-brand-gold transition duration-300 cursor-pointer"
        >
          Voir toute la collection
        </button>
      </div>

      {/* Grid containing related items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recommendations.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelectProduct(item)}
            className="group cursor-pointer space-y-4"
          >
            {/* Overlay and zoom container */}
            <div className="aspect-[3/4] overflow-hidden bg-brand-low border border-brand-container/40 relative">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              
              {/* Quick View overlay */}
              <div className="absolute inset-0 bg-brand-charcoal/10 py-6 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center">
                <span className="bg-brand-charcoal text-brand-beige px-6 py-3 font-sans text-[10px] tracking-widest font-semibold uppercase shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  Découvrir
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="pt-2">
              <h3 className="font-sans text-xs font-semibold text-brand-charcoal uppercase tracking-widest group-hover:text-brand-gold transition duration-300">
                {item.name}
              </h3>
              <p className="font-serif text-sm text-brand-charcoal-light/80 mt-1">
                {item.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
