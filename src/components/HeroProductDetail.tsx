import React, { useState, useEffect } from 'react';
import { Product, FabricOption } from '../types';
import { Plus, Minus, Check, MapPin, Sparkles } from 'lucide-react';

interface HeroProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, fabric?: FabricOption) => void;
}

const categoryTranslations: Record<string, string> = {
  'Living Room': 'Salon',
  'Bedroom': 'Chambre',
  'Dining': 'Salle à Manger',
  'Office': 'Bureau'
};

export default function HeroProductDetail({ product, onAddToCart }: HeroProductDetailProps) {
  // Fabric selection (defaulting to the first fabric if available)
  const [selectedFabric, setSelectedFabric] = useState<FabricOption | undefined>(
    product.fabrics && product.fabrics.length > 0 ? product.fabrics[0] : undefined
  );

  // Dynamic image state
  const [currentHeroImage, setCurrentHeroImage] = useState<string>(product.imageUrl);

  // Accordion details toggle list
  const [shippingOpen, setShippingOpen] = useState(false);
  const [careOpen, setCareOpen] = useState(false);

  // Quick feedback state upon adding to basket
  const [justAdded, setJustAdded] = useState(false);

  // Dynamic update when product changes
  useEffect(() => {
    const defaultFabric = product.fabrics && product.fabrics.length > 0 ? product.fabrics[0] : undefined;
    setSelectedFabric(defaultFabric);
    setCurrentHeroImage(defaultFabric ? defaultFabric.previewUrl : product.imageUrl);
    setShippingOpen(false);
    setCareOpen(false);
  }, [product]);

  // Handle fabric swatch click
  const handleFabricSelect = (fabric: FabricOption) => {
    setSelectedFabric(fabric);
    // Dynamic image swap
    setCurrentHeroImage(fabric.previewUrl);
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedFabric);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-10">
      
      {/* LEFT COLUMN: Media Gallery Lookbook */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Elite Hero Image Container */}
        <div className="aspect-[4/5] w-full overflow-hidden bg-brand-low border border-brand-container/40 relative group">
          <img 
            src={currentHeroImage} 
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-all duration-1000 ease-out transform group-hover:scale-102"
          />
          <div className="absolute top-4 left-4 bg-brand-beige/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-semibold border border-brand-charcoal/10 rounded-sm">
            Atelier Aura
          </div>
        </div>

        {/* Sub-gallery elements (only if we have additional images) */}
        {product.additionalImages && product.additionalImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {product.additionalImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroImage(img)}
                className={`aspect-square overflow-hidden bg-brand-low border cursor-pointer transition-all duration-500 hover:opacity-100 ${
                  currentHeroImage === img 
                    ? 'border-brand-gold ring-1 ring-brand-gold' 
                    : 'border-brand-container/40 opacity-80'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} detail view ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Styling Details, Swatches, Accordion */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-10 pl-0 lg:pl-6">
        
        {/* Category & Headline */}
        <header className="space-y-4">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-brand-gold font-bold">
            {product.subCategory || `${(categoryTranslations[product.category] || product.category).toUpperCase()} — COLLECTION`}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-charcoal tracking-tight leading-tight">
            {product.name}
          </h1>
          <p className="font-serif text-xl text-brand-charcoal font-light">
            {product.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </p>
        </header>

        {/* Brand Narrative */}
        <p className="font-sans text-brand-charcoal-light text-sm md:text-base leading-relaxed max-w-prose font-light">
          {product.description}
        </p>

        {/* Dynamic Fabric Color Selector Swatch Panel */}
        {product.fabrics && product.fabrics.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-brand-container-high/40">
            <div className="flex justify-between items-center text-xs tracking-widest font-semibold">
              <span className="uppercase text-brand-charcoal">Sélectionner le Tissu</span>
              <span className="text-brand-gold lowercase italic font-normal">
                {selectedFabric?.name}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {product.fabrics.map((fabric) => {
                const isSelected = selectedFabric?.id === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    onClick={() => handleFabricSelect(fabric)}
                    style={{ backgroundColor: fabric.hex }}
                    className={`w-12 h-12 rounded-full cursor-pointer relative shadow-sm border transition-luxury-fast outline-none ${
                      isSelected 
                        ? 'ring-2 ring-offset-2 ring-brand-charcoal border-white scale-105' 
                        : 'border-brand-outline-variant/30 hover:scale-105'
                    }`}
                    title={fabric.name}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-md" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Button Actions */}
        <div className="space-y-4 pt-4">
          <button
            onClick={handleAddToCartClick}
            className={`w-full py-5 text-xs text-center uppercase tracking-widest font-semibold transition-luxury duration-300 hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer ${
              justAdded 
                ? 'bg-brand-gold text-white gold-pulse-border' 
                : 'bg-brand-charcoal text-brand-beige'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                Ajouté au panier !
              </>
            ) : (
              'Ajouter au Panier'
            )}
          </button>
          
          <button
            type="button"
            className="w-full py-5 border border-brand-charcoal text-brand-charcoal text-xs text-center uppercase tracking-widest font-semibold hover:bg-brand-low transition-luxury duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            Trouver en Boutique
          </button>
        </div>

        {/* Secondary Info Accordions */}
        <div className="pt-6 border-t border-brand-container-high/40 flex flex-col gap-4">
          
          {/* Shipping & Returns */}
          <div className="border-b border-brand-container/40 pb-4">
            <button
              onClick={() => setShippingOpen(!shippingOpen)}
              className="w-full flex justify-between items-center group cursor-pointer"
            >
              <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-brand-charcoal group-hover:text-brand-gold transition duration-300">
                LIVRAISON &amp; RETOURS
              </span>
              <span className="text-brand-charcoal group-hover:text-brand-gold transition">
                {shippingOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <div 
              className={`transition-all duration-500 overflow-hidden ${
                shippingOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="font-sans text-xs text-brand-charcoal-light leading-relaxed font-light">
                {product.shippingInfo || 'Livraison standard gratuite. Nous prenons en charge la livraison de gants blancs dans la pièce de votre choix, l’assemblage et le retrait des emballages.'}
              </p>
            </div>
          </div>

          {/* Care Instructions */}
          <div className="pb-2">
            <button
              onClick={() => setCareOpen(!careOpen)}
              className="w-full flex justify-between items-center group cursor-pointer"
            >
              <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-brand-charcoal group-hover:text-brand-gold transition duration-300">
                RECOMMANDATIONS D’ENTRETIEN
              </span>
              <span className="text-brand-charcoal group-hover:text-brand-gold transition">
                {careOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <div 
              className={`transition-all duration-500 overflow-hidden ${
                careOpen ? 'max-h-44 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="font-sans text-xs text-brand-charcoal-light leading-relaxed font-light">
                {product.careInstructions || 'Évitez l’exposition directe au soleil et aux sources de chaleur. Dépoussiérez régulièrement à l’aide d’un chiffon doux. Nettoyage professionnel recommandé en cas de tache.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
