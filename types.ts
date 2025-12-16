export enum ScreenState {
  SELECTION = 'SELECTION',
  LOADING = 'LOADING',
  PREVIEW = 'PREVIEW',
  PREPARATION = 'PREPARATION',
}

export enum PrepType {
  TISANA = 'Tisana/Infuso',
  DECOTTO = 'Decotto',
  IMPACCO = 'Impacco/Uso topico',
  SCIROPPO = 'Sciroppo',
  ANY = 'Qualsiasi',
}

export enum TimeAvailable {
  QUICK = 'Veloce (< 10 min)',
  NORMAL = 'Normale (10-20 min)',
  LONG = 'Ho tempo (> 20 min)',
}

export interface IngredientCategory {
  id: string;
  title: string;
  icon: string;
  items: string[];
}

export interface UserPreferences {
  symptoms: string[];
  prepType: PrepType;
  ingredients: string[];
  time: TimeAvailable;
}

export interface RecipeStep {
  instruction: string;
  tip?: string;
}

export interface Recipe {
  title: string;
  tagline: string;
  timeMinutes: number;
  ingredientCount: number;
  stepCount: number;
  difficulty: 'Facile' | 'Media' | 'Difficile';
  rating: number; // 4.5 to 5.0
  ingredientsList: { name: string; amount: string }[];
  toolsList: string[]; // List of common kitchen tools
  benefits: string;
  steps: RecipeStep[];
  imageUrl?: string; // Generated image URL
  prepType?: string; // Stored prep type for image context
}

export interface ChatMessage {
  id: string;
  sender: 'app' | 'user';
  text: string;
  isTip?: boolean;
}