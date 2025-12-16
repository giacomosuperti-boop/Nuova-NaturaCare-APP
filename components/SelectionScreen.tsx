import React, { useState } from 'react';
import { PrepType, TimeAvailable, UserPreferences } from '../types';
import { SYMPTOM_CATEGORIES, PREP_OPTIONS, TIME_OPTIONS, INGREDIENT_CATEGORIES } from '../constants';
import { Accordion } from './ui/Accordion';

interface SelectionScreenProps {
  initialPrefs: UserPreferences;
  onSearch: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ initialPrefs, onSearch, isLoading }) => {
  const [prefs, setPrefs] = useState<UserPreferences>(initialPrefs);

  // Helper to find which category a symptom belongs to
  const getSymptomCategory = (symptomName: string) => {
    return SYMPTOM_CATEGORIES.find(cat => cat.items.includes(symptomName))?.name;
  };

  // Determine the currently active category based on the first selected symptom
  const activeCategoryName = prefs.symptoms.length > 0 
    ? getSymptomCategory(prefs.symptoms[0]) 
    : null;

  const toggleSymptom = (symptom: string) => {
    setPrefs(prev => {
      const exists = prev.symptoms.includes(symptom);
      
      // If adding a new symptom
      if (!exists) {
        // Constraint 1: Logic correlation (must be same category)
        const newSympCategory = getSymptomCategory(symptom);
        const currentCategory = prev.symptoms.length > 0 ? getSymptomCategory(prev.symptoms[0]) : null;
        
        if (currentCategory && newSympCategory !== currentCategory) {
            // Should be prevented by UI, but safety check here
            return prev;
        }

        // Constraint 2: Max 2 symptoms
        if (prev.symptoms.length >= 2) return prev;

        return { ...prev, symptoms: [...prev.symptoms, symptom] };
      }

      // If removing
      return {
        ...prev,
        symptoms: prev.symptoms.filter(s => s !== symptom)
      };
    });
  };

  const toggleIngredient = (ingredient: string) => {
    setPrefs(prev => {
      const exists = prev.ingredients.includes(ingredient);
      return {
        ...prev,
        ingredients: exists
          ? prev.ingredients.filter(i => i !== ingredient)
          : [...prev.ingredients, ingredient]
      };
    });
  };

  const selectAllCategory = (items: string[]) => {
    setPrefs(prev => {
      // Add all items that aren't already selected
      const newIngredients = [...prev.ingredients];
      items.forEach(item => {
        if (!newIngredients.includes(item)) newIngredients.push(item);
      });
      return { ...prev, ingredients: newIngredients };
    });
  };

  const isValid = prefs.ingredients.length >= 2 && prefs.symptoms.length > 0;

  return (
    <div className="pb-24 animate-fade-in">
      <header className="p-6 pb-2">
        <h1 className="text-3xl font-bold text-stone-800">Crea il tuo <br/><span className="text-nature-600">Rimedio Naturale</span></h1>
        <p className="text-stone-500 mt-2">Seleziona sintomi e ingredienti per iniziare.</p>
      </header>

      {/* Symptoms Section */}
      <section className="px-6 py-4">
        <h2 className="text-lg font-semibold text-stone-800 mb-1">Cosa vuoi trattare?</h2>
        <p className="text-xs text-stone-500 mb-4">
          Puoi combinare massimo 2 disturbi della stessa categoria per un rimedio efficace.
        </p>
        
        <div className="space-y-4">
          {SYMPTOM_CATEGORIES.map((cat) => {
            const isCategoryDisabled = activeCategoryName !== null && activeCategoryName !== cat.name;

            return (
              <div key={cat.name} className={`transition-opacity duration-300 ${isCategoryDisabled ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                <h3 className="text-sm font-medium text-stone-500 mb-2 uppercase tracking-wide flex items-center justify-between">
                    {cat.name}
                    {isCategoryDisabled && <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-400 normal-case">Non compatibile</span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((symptom) => {
                    const isSelected = prefs.symptoms.includes(symptom);
                    // Disable if: 
                    // 1. Another category is active
                    // 2. Max limit reached AND this item isn't selected
                    const isDisabled = isCategoryDisabled || (!isSelected && prefs.symptoms.length >= 2);

                    return (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-lg text-sm transition-all border ${
                          isSelected
                            ? 'bg-nature-100 text-nature-800 border-nature-300 font-medium transform scale-105 shadow-sm'
                            : 'bg-white text-stone-600 border-stone-200'
                        } ${isDisabled ? 'cursor-not-allowed bg-stone-50 text-stone-400 border-stone-100' : 'hover:border-nature-200'}`}
                      >
                        {symptom}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {prefs.symptoms.length === 0 && (
          <p className="text-xs text-orange-400 mt-2 italic">Seleziona almeno un disturbo</p>
        )}
      </section>

      {/* Prep Type Section */}
      <section className="px-6 py-4">
        <h2 className="text-lg font-semibold text-stone-800 mb-3">Come preferisci prepararlo?</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PREP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPrefs(p => ({ ...p, prepType: opt.value }))}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                prefs.prepType === opt.value
                  ? 'bg-earth-100 border-earth-400 text-earth-800 ring-1 ring-earth-400'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs font-medium text-center">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="px-6 py-4">
        <div className="flex justify-between items-end mb-3">
            <h2 className="text-lg font-semibold text-stone-800">Cosa hai in dispensa?</h2>
            <span className="text-xs font-medium bg-stone-100 px-2 py-1 rounded-md text-stone-600">
                {prefs.ingredients.length} selezionati
            </span>
        </div>
        
        {INGREDIENT_CATEGORIES.map((cat) => (
          <Accordion
            key={cat.id}
            category={cat}
            selectedIngredients={prefs.ingredients}
            onToggleIngredient={toggleIngredient}
            onSelectAll={selectAllCategory}
          />
        ))}
        {prefs.ingredients.length < 2 && (
          <p className="text-xs text-orange-400 mt-2 italic">Seleziona almeno 2 ingredienti</p>
        )}
      </section>

      {/* Time Section */}
      <section className="px-6 py-4">
        <h2 className="text-lg font-semibold text-stone-800 mb-3">Quanto tempo hai?</h2>
        <div className="flex flex-col gap-2">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPrefs(p => ({ ...p, time: opt.value }))}
              className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                prefs.time === opt.value
                  ? 'bg-nature-50 border-nature-400 text-nature-800 ring-1 ring-nature-400'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{opt.icon}</span>
                <span className="font-medium">{opt.label}</span>
              </div>
              <span className="text-xs opacity-70">{opt.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Sticky Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-10">
        <button
          onClick={() => onSearch(prefs)}
          disabled={!isValid || isLoading}
          className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
            !isValid || isLoading
              ? 'bg-stone-300 cursor-not-allowed'
              : 'bg-nature-600 hover:bg-nature-700 shadow-nature-300/50'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sto cercando il rimedio perfetto...</span>
            </>
          ) : (
            <span>Trova il mio rimedio</span>
          )}
        </button>
      </div>
    </div>
  );
};