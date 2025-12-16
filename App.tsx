import React, { useState } from 'react';
import { ScreenState, UserPreferences, PrepType, TimeAvailable, Recipe } from './types';
import { SelectionScreen } from './components/SelectionScreen';
import { PreviewScreen } from './components/PreviewScreen';
import { PreparationScreen } from './components/PreparationScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { generateRecipe, generateRemedyImage } from './services/geminiService';

const DEFAULT_PREFS: UserPreferences = {
  symptoms: [],
  prepType: PrepType.ANY,
  ingredients: [],
  time: TimeAvailable.NORMAL,
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(ScreenState.SELECTION);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFS);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setCurrentScreen(ScreenState.LOADING);
    setError(null);
    
    try {
      // Step 1: Generate Recipe Text (No previous recipe context)
      const generatedRecipe = await generateRecipe(prefs, null);
      
      // Step 2: Generate Image
      try {
        const imageUrl = await generateRemedyImage(generatedRecipe);
        generatedRecipe.imageUrl = imageUrl;
      } catch (imgError) {
        console.warn("Image generation failed silently", imgError);
      }

      setRecipe(generatedRecipe);
      setCurrentScreen(ScreenState.PREVIEW);

    } catch (err) {
      setError("Ops! Qualcosa è andato storto. Riprova.");
      console.error(err);
      setCurrentScreen(ScreenState.SELECTION);
    }
  };

  const handleRegenerate = async () => {
    if (!preferences) return;
    
    // Show full screen loading for the "magic" effect
    setCurrentScreen(ScreenState.LOADING);
    
    try {
      // Step 1: Generate Recipe Text (Pass current recipe to force variety)
      const generatedRecipe = await generateRecipe(preferences, recipe);
      
      // Step 2: Generate Image
      try {
        const imageUrl = await generateRemedyImage(generatedRecipe);
        generatedRecipe.imageUrl = imageUrl;
      } catch (imgError) {
        console.warn("Image generation failed silently", imgError);
      }
      
      setRecipe(generatedRecipe);
      setCurrentScreen(ScreenState.PREVIEW);
    } catch (err) {
      setError("Non sono riuscito a creare una nuova ricetta. Riprova.");
      // If failed, restore the old recipe view or go back
      if (recipe) {
          setCurrentScreen(ScreenState.PREVIEW);
      } else {
          setCurrentScreen(ScreenState.SELECTION); 
      }
    }
  };

  const handleReset = () => {
    setCurrentScreen(ScreenState.SELECTION);
    setRecipe(null);
    setPreferences(DEFAULT_PREFS);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-nature-200">
      
      {/* Global Error Toast */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg flex items-center justify-between animate-bounce-in">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-2 font-bold">&times;</button>
        </div>
      )}

      {currentScreen === ScreenState.SELECTION && (
        <SelectionScreen 
          initialPrefs={preferences} 
          onSearch={handleSearch} 
          isLoading={false} 
        />
      )}

      {currentScreen === ScreenState.LOADING && (
        <LoadingScreen />
      )}

      {currentScreen === ScreenState.PREVIEW && recipe && (
        <PreviewScreen
          recipe={recipe}
          onBack={() => setCurrentScreen(ScreenState.SELECTION)}
          onStart={() => setCurrentScreen(ScreenState.PREPARATION)}
          onRegenerate={handleRegenerate}
          isRegenerating={false}
        />
      )}

      {currentScreen === ScreenState.PREPARATION && recipe && (
        <PreparationScreen
          recipe={recipe}
          onExit={() => setCurrentScreen(ScreenState.PREVIEW)}
          onComplete={handleReset}
        />
      )}
    </div>
  );
};

export default App;