import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onSelectProduct
}: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Dark blur backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-xs transition-opacity duration-500 cursor-pointer"
      />

      {/* Cart Panel sidebar drawer */}
      <div className="relative w-full max-w-md h-full bg-brand-beige border-l border-brand-container-high/60 shadow-2xl flex flex-col z-10 animate-slide-in">
        
        {/* Header bar */}
        <div className="p-6 border-b border-brand-container-high/60 flex justify-between items-center bg-brand-low">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-brand-charcoal" />
            <h2 className="font-serif text-lg tracking-tight text-brand-charcoal">
              Votre Panier ({totalItems})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:opacity-60 transition text-brand-charcoal cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-hide">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-low flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-brand-charcoal/40" />
              </div>
              <div>
                <p className="font-serif text-base text-brand-charcoal text-center">Votre panier est vide</p>
                <p className="font-sans text-xs text-brand-charcoal-light/60 mt-1 max-w-[240px]">
                  Explorez et ajoutez nos pièces de créateurs pour commencer à aménager votre espace.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-3 bg-brand-charcoal text-brand-beige text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition duration-300"
              >
                Continuer l’exploration
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 border-b border-brand-container/60 pb-6 items-start"
              >
                {/* Thumb photo */}
                <div 
                  onClick={() => {
                    onSelectProduct(item.product.id);
                    onClose();
                  }}
                  className="w-20 h-24 bg-brand-low overflow-hidden border border-brand-container-high/40 flex-shrink-0 cursor-pointer"
                >
                  <img 
                    src={item.selectedFabric ? item.selectedFabric.previewUrl : item.product.imageUrl} 
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info and modifiers */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 
                      onClick={() => {
                        onSelectProduct(item.product.id);
                        onClose();
                      }}
                      className="font-sans text-xs font-bold uppercase tracking-widest text-brand-charcoal cursor-pointer hover:text-brand-gold transition"
                    >
                      {item.product.name}
                    </h3>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-brand-charcoal/40 hover:text-red-600 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.selectedFabric && (
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-brand-charcoal/20" 
                        style={{ backgroundColor: item.selectedFabric.hex }}
                      />
                      <span className="font-sans text-[11px] text-brand-charcoal-light italic">
                        {item.selectedFabric.name}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    {/* Counter widget */}
                    <div className="flex items-center border border-brand-container-high/80 rounded-sm">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-xs hover:bg-brand-low transition font-bold"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-xs hover:bg-brand-low transition font-bold"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-serif text-sm text-brand-charcoal font-semibold">
                      {(item.product.price * item.quantity).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout action bar */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-brand-low border-t border-brand-container-high/60 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-sans text-xs uppercase tracking-widest font-semibold text-brand-charcoal-light">Sous-total</span>
              <span className="font-serif text-lg font-bold text-brand-charcoal">
                {subtotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </span>
            </div>
            
            <p className="font-sans text-[10px] text-brand-charcoal-light/60 leading-normal">
              Frais de port et taxes calculés au moment de l’expédition. Comprend notre prestigieux service de gants blancs Atelier Aura.
            </p>

            <button
              onClick={() => alert(`Félicitations pour votre commande de ${subtotal.toLocaleString('fr-FR')} € chez AURA Interiors ! Notre équipe d'Art Directors prendra contact avec vous sous 24h.`)}
              className="w-full py-4 bg-brand-charcoal hover:bg-brand-gold text-brand-beige text-xs uppercase tracking-widest font-semibold transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
            >
              Procéder au Paiement
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
