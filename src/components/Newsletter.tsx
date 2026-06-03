import React, { useState } from 'react';

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="mt-28 py-20 bg-brand-low border-y border-brand-container-high/40 text-center">
      <div className="max-w-2xl mx-auto px-6 space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-brand-charcoal">
          S’inscrire aux Correspondances Aura
        </h2>
        <p className="font-sans text-xs md:text-sm text-brand-charcoal-light/70 max-w-prose mx-auto leading-relaxed font-light">
          Soyez le premier au courant de l’annonce de nos nouvelles collections exclusives, de nos conseils d’Art Directors, et de vernissages dans nos showrooms d’exception.
        </p>

        {subscribed ? (
          <div className="p-4 bg-brand-gold/10 border border-brand-gold/30 rounded text-brand-gold text-xs uppercase tracking-widest font-semibold animate-fade-in">
            Merci. Vous faites désormais partie du cercle privilégié d'Atelier Aura.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-4 justify-between">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@domain.com"
              required
              className="flex-1 bg-brand-container border border-brand-container-high/60 rounded px-4 py-3 text-xs text-brand-charcoal outline-none focus:border-brand-gold font-light placeholder:text-brand-charcoal-light/55"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-charcoal hover:bg-brand-gold text-brand-beige text-xs uppercase tracking-widest font-semibold transition-all duration-500 cursor-pointer"
            >
              S’abonner
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
