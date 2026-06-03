import React from 'react';
import { Product } from '../types';

interface TechnicalSpecsProps {
  product: Product;
}

export default function TechnicalSpecs({ product }: TechnicalSpecsProps) {
  return (
    <section className="mt-28 py-16 border-t border-brand-container-high/40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left: Section Header title */}
         <div className="md:col-span-4">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal tracking-tight">
            Spécifications<br />Techniques
          </h2>
        </div>
        
        {/* Right: Technical properties list matching image structure */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
          
          <div className="border-b border-brand-container-high/40 pb-4">
            <p className="font-sans text-[11px] font-bold text-brand-gold tracking-[0.15em] mb-2">DIMENSIONS</p>
            <p className="font-sans text-sm md:text-base text-brand-charcoal font-light">{product.dimensions}</p>
          </div>
          
          <div className="border-b border-brand-container-high/40 pb-4">
            <p className="font-sans text-[11px] font-bold text-brand-gold tracking-[0.15em] mb-2">MATÉRIAUX</p>
            <p className="font-sans text-sm md:text-base text-brand-charcoal font-light">{product.materials}</p>
          </div>
          
          <div className="border-b border-brand-container-high/40 pb-4">
            <p className="font-sans text-[11px] font-bold text-brand-gold tracking-[0.15em] mb-2">CHARGE MAXIMALE</p>
            <p className="font-sans text-sm md:text-base text-brand-charcoal font-light">{product.weightCapacity}</p>
          </div>
          
          <div className="border-b border-brand-container-high/40 pb-4">
            <p className="font-sans text-[11px] font-bold text-brand-gold tracking-[0.15em] mb-2">ORIGINE</p>
            <p className="font-sans text-sm md:text-base text-brand-charcoal font-light">{product.origin}</p>
          </div>
          
        </div>

      </div>
    </section>
  );
}
