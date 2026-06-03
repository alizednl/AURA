import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, ArrowUpRight, HelpCircle } from 'lucide-react';
import { ChatMessage, Product } from '../types';

interface VirtualConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function VirtualConcierge({
  isOpen,
  onClose,
  allProducts,
  onSelectProduct,
  onAddToCart
}: VirtualConciergeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Bienvenue dans l'Atelier Aura. Je suis votre directeur artistique personnel. \n\nParlez-moi de votre espace, de sa luminosité, de vos aspirations en matière de matériaux (marbre, bouclé, velours, lin, laiton) et je concevrai une atmosphère sur mesure pour votre sanctuaire.",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      recommendations: ['velvet-serenity-sofa', 'aurora-marble-table']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick suggestion prompts matching our products
  const suggestionPrompts = [
    "Conseillez-moi pour un salon minimaliste chaleureux",
    "Aménager mon petit bureau lumineux",
    "Quelles matières associer à un lit en lin ?"
  ];

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6) // Send recent message tuples to keep session context
        })
      });

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.text || "Pardonnez-moi, l'Atelier rencontre un léger contretemps technique. Que puis-je faire pour vous ?",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        recommendations: data.recommendations || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      // Fail gracefully
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "Nos stylistes sont à votre écoute. Je vous invite à explorer notre Velvet Serenity Sofa et l'Aurora Marble Table qui s'unissent à merveille pour fonder les bases d'un salon Quiet Luxury d'exception.",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        recommendations: ['velvet-serenity-sofa', 'aurora-marble-table']
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Dark blur overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-xs transition-opacity duration-500 cursor-pointer"
      />

      {/* Main concierge panel */}
      <div className="relative w-full max-w-lg h-full bg-brand-beige border-l border-brand-container-high/60 shadow-2xl flex flex-col z-10 animate-slide-in">
        
        {/* Header styling */}
        <div className="p-6 border-b border-brand-container-high/60 flex justify-between items-center bg-brand-charcoal text-brand-beige">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-gold rounded-full">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-lg tracking-tight">Le Concierge Aura</h2>
              <p className="font-sans text-[10px] text-brand-beige/60 tracking-widest uppercase font-semibold">Conseils d'Art & de Style</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:opacity-60 transition text-brand-beige cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message body section */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-hide bg-brand-low"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message bubble */}
              <div 
                className={`max-w-[85%] rounded-md p-4 space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-brand-charcoal text-brand-beige rounded-tr-none'
                    : 'bg-brand-lowest text-brand-charcoal border border-brand-container-high/60 shadow-xs rounded-tl-none'
                }`}
              >
                <div className="text-xs md:text-sm font-sans font-light leading-relaxed whitespace-pre-line">
                  {msg.text}
                </div>
                <div className={`text-[9px] text-right font-mono ${msg.sender === 'user' ? 'text-brand-beige/50' : 'text-brand-charcoal-light/40'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {/* Dynamic product recommendation cards (Only for assistant responses) */}
              {msg.sender === 'assistant' && msg.recommendations && msg.recommendations.length > 0 && (
                <div className="w-full max-w-[85%] mt-2 space-y-2">
                  <p className="font-sans text-[10px] tracking-wider uppercase font-semibold text-brand-gold">PIÈCES RECOMMANDÉES PAR L’AURA :</p>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {msg.recommendations.map((recId) => {
                      const item = allProducts.find((p) => p.id === recId);
                      if (!item) return null;
                      return (
                        <div 
                          key={item.id}
                          className="flex items-center gap-3 bg-brand-container p-3 rounded-md border border-brand-container-high/40 hover:border-brand-gold transition-all duration-300 shadow-2xs group"
                        >
                          {/* Image mini thumb */}
                          <div className="w-12 h-14 bg-brand-low overflow-hidden rounded-sm flex-shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>

                          {/* Meta & actions */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-brand-charcoal truncate">{item.name}</h4>
                            <p className="font-serif text-xs text-brand-gold mt-0.5">{item.price.toLocaleString('fr-FR')} €</p>
                          </div>

                          <button
                            onClick={() => {
                              onSelectProduct(item);
                              onClose();
                            }}
                            className="p-1 px-2.5 text-[10px] uppercase font-bold tracking-widest text-brand-charcoal hover:bg-brand-low rounded border border-brand-charcoal/20 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            DÉCOUVRIR
                            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing visual effect indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-brand-gold text-xs font-semibold uppercase tracking-widest">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              L'Atelier réfléchit...
            </div>
          )}
        </div>

        {/* Suggestion Prompt Chips */}
        {messages.length <= 1 && (
          <div className="px-6 py-4 border-t border-brand-container/40 space-y-2 bg-brand-beige">
            <span className="font-sans text-[10px] uppercase tracking-widest font-semibold text-brand-charcoal-light flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Suggestions de questions
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestionPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p)}
                  className="px-3 py-2 text-left bg-brand-container hover:bg-brand-lowest border border-brand-container-high/60 hover:border-brand-gold transition text-xs font-light text-brand-charcoal rounded duration-300 max-w-full truncate cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive input form row */}
        <form 
          onSubmit={handleFormSubmit}
          className="p-6 border-t border-brand-container-high/60 flex gap-3 items-center bg-brand-beige justify-between"
        >
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Écrivez à votre conseiller Aura..."
            className="flex-1 bg-brand-lowest border border-brand-container-high/60 rounded px-4 py-3.5 text-sm text-brand-charcoal outline-none focus:border-brand-gold transition-colors font-light placeholder:text-brand-charcoal-light/40"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-3.5 bg-brand-charcoal text-brand-beige hover:bg-brand-gold rounded transition duration-300 cursor-pointer disabled:opacity-40"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
