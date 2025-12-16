import React, { useState } from 'react';
import { IngredientCategory } from '../../types';

interface AccordionProps {
  category: IngredientCategory;
  selectedIngredients: string[];
  onToggleIngredient: (ing: string) => void;
  onSelectAll: (items: string[]) => void;
}

export const Accordion: React.FC<AccordionProps> = ({ category, selectedIngredients, onToggleIngredient, onSelectAll }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCount = category.items.filter(item => selectedIngredients.includes(item)).length;

  return (
    <div className="mb-3 border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="font-semibold text-stone-800">{category.title}</h3>
            <p className="text-xs text-stone-500">
              {selectedCount > 0 ? `${selectedCount} selezionati` : 'Nessuno selezionato'}
            </p>
          </div>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 bg-stone-50 border-t border-stone-100">
          <div className="flex justify-end mb-2">
             <button 
                onClick={(e) => { e.stopPropagation(); onSelectAll(category.items); }}
                className="text-xs text-nature-600 font-medium hover:underline py-2"
             >
               Seleziona tutti
             </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.items.map((item) => {
              const isSelected = selectedIngredients.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => onToggleIngredient(item)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                    isSelected
                      ? 'bg-nature-500 text-white border-nature-500 shadow-md transform scale-105'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-nature-300'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};