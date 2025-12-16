import React from 'react';
import { Recipe } from '../types';

interface PreviewScreenProps {
  recipe: Recipe;
  onBack: () => void;
  onStart: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({ recipe, onBack, onStart, onRegenerate, isRegenerating }) => {
  return (
    <div className="min-h-screen bg-stone-50 pb-48 animate-fade-in">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 px-6 py-4 flex items-center bg-white/80 backdrop-blur-md border-b border-stone-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="ml-4 font-semibold text-lg text-stone-800">Il tuo rimedio</h1>
      </header>

      {/* Content */}
      <main className="pt-20 px-6">
        
        {/* Image Card */}
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl mb-6 bg-stone-200">
           {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover animate-fade-in" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-stone-400">
               <span className="animate-pulse">Generazione immagine...</span>
             </div>
           )}
           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-800 flex items-center shadow-sm">
             <span className="text-yellow-400 mr-1">★</span> {recipe.rating}
           </div>
        </div>

        {/* Title & Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-800 leading-tight mb-1">{recipe.title}</h2>
          <p className="text-stone-500 italic mb-4">{recipe.tagline}</p>
          
          <div className="flex flex-wrap gap-3">
             <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
               ⏱️ {recipe.timeMinutes} min
             </span>
             <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
               🥄 {recipe.ingredientCount} ingr.
             </span>
             <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">
               📊 {recipe.stepCount} step
             </span>
             <span className="inline-flex items-center px-3 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium">
               💪 {recipe.difficulty}
             </span>
          </div>
        </div>

        {/* What You Need Section (Ingredients + Tools) */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-stone-100">
          <h3 className="text-lg font-bold text-stone-800 mb-6">Cosa ti serve</h3>
          
          {/* Ingredients Sub-section */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>🌿</span> Ingredienti
            </h4>
            <ul className="space-y-3">
              {recipe.ingredientsList.map((ing, idx) => (
                <li key={idx} className="flex items-start justify-between text-sm">
                  <span className="text-stone-800 font-medium">{ing.name}</span>
                  <span className="text-stone-500 text-right ml-4">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100 my-5"></div>

          {/* Tools Sub-section */}
          <div>
            <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>🥣</span> Strumenti
            </h4>
            <ul className="space-y-2">
              {recipe.toolsList && recipe.toolsList.length > 0 ? (
                recipe.toolsList.map((tool, idx) => (
                  <li key={idx} className="flex items-center text-sm text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mr-3 flex-shrink-0"></span>
                    <span className="capitalize">{tool}</span>
                  </li>
                ))
              ) : (
                 <li className="text-sm text-stone-400 italic">Strumenti base da cucina</li>
              )}
            </ul>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8 p-6 bg-nature-50 rounded-2xl border border-nature-100">
          <h3 className="text-lg font-bold text-nature-800 mb-2">Perché funziona</h3>
          <p className="text-nature-700 text-sm leading-relaxed">
            {recipe.benefits}
          </p>
        </div>

      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-stone-100 z-20 flex flex-col gap-3">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-nature-600 text-white font-bold text-lg shadow-lg shadow-nature-300/50 hover:bg-nature-700 transition-all active:scale-95 flex justify-center items-center"
        >
          Facciamolo!
        </button>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="w-full py-3 rounded-2xl bg-white text-stone-600 font-medium border border-stone-200 hover:bg-stone-50 transition-all text-sm flex justify-center items-center"
        >
           {isRegenerating ? (
             <>
               <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-stone-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sto creando il rimedio...
             </>
           ) : "Genera un'altra ricetta"}
        </button>
      </div>
    </div>
  );
};