import React from 'react';

interface FooterProps {
  onSetCategory: (cat: string) => void;
}

export default function Footer({ onSetCategory }: FooterProps) {
  return (
    <footer className="w-full mt-28 bg-brand-low border-t border-brand-container-high/60">
      
      {/* 4-column footer links grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-20 py-20 max-w-[1440px] mx-auto">
        
        {/* Brand narrative col */}
        <div className="space-y-6">
          <button 
            type="button" 
            onClick={() => onSetCategory('All Collections')}
            className="font-serif text-3xl text-brand-charcoal hover:opacity-80 transition tracking-tighter"
          >
            AURA
          </button>
          <p className="font-sans text-xs md:text-sm text-brand-charcoal-light max-w-[240px] leading-relaxed font-light">
            Redéfinir l'art de vivre contemporain à travers la précision architecturale et l'esthétique du Quiet Luxury.
          </p>
        </div>

        {/* Discover */}
        <div className="space-y-6">
          <p className="font-sans text-[11px] font-bold text-brand-charcoal tracking-widest uppercase">Découvrir</p>
          <ul className="space-y-4">
            <li>
              <a href="#" className="font-sans text-xs md:text-sm text-brand-charcoal-light hover:text-brand-gold transition duration-300">
                Lettre d'Information
              </a>
            </li>
            <li>
              <a href="#" className="font-sans text-xs md:text-sm text-brand-charcoal-light hover:text-brand-gold transition duration-300">
                Nos Ateliers & Boutiques
              </a>
            </li>
            <li>
              <a href="#" className="font-sans text-xs md:text-sm text-brand-charcoal-light hover:text-brand-gold transition duration-300">
                Éco-responsabilité
              </a>
            </li>
          </ul>
        </div>

        {/* Client Services */}
        <div className="space-y-6">
          <p className="font-sans text-[11px] font-bold text-brand-charcoal tracking-widest uppercase">Service Client</p>
          <ul className="space-y-4">
            <li>
              <a href="#" className="font-sans text-xs md:text-sm text-brand-charcoal-light hover:text-brand-gold transition duration-300">
                Nous Contacter
              </a>
            </li>
            <li>
              <a href="#" className="font-sans text-xs md:text-sm text-brand-charcoal-light hover:text-brand-gold transition duration-300">
                Informations de Livraison
              </a>
            </li>
            <li>
              <a href="#" className="font-sans text-xs md:text-sm text-brand-charcoal-light hover:text-brand-gold transition duration-300">
                Suivi de Retours
              </a>
            </li>
          </ul>
        </div>

        {/* Follow */}
        <div className="space-y-6">
          <p className="font-sans text-[11px] font-bold text-brand-charcoal tracking-widest uppercase font-semibold">Suivre AURA</p>
          <ul className="space-y-4">
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="font-sans text-xs md:text-sm text-brand-charcoal-light hover:text-brand-gold transition duration-300">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="font-sans text-xs md:text-sm text-brand-charcoal-light hover:text-brand-gold transition duration-300">
                Pinterest
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Row credits & copyright */}
      <div className="px-6 md:px-20 py-12 border-t border-brand-container-high/40 max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-sans text-xs text-brand-charcoal-light/60">
          © {new Date().getFullYear()} AURA INTERIORS. TOUS DROITS RÉSERVÉS.
        </p>
        <div className="flex gap-8">
          <a href="#" className="font-sans text-[10px] text-brand-charcoal-light/60 uppercase tracking-widest hover:text-brand-gold transition">
            POLITIQUE DE CONFIDENTIALITÉ
          </a>
          <a href="#" className="font-sans text-[10px] text-brand-charcoal-light/60 uppercase tracking-widest hover:text-brand-gold transition">
            CONDITIONS GÉNÉRALES
          </a>
        </div>
      </div>

    </footer>
  );
}
