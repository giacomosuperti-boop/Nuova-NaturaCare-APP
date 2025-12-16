import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, UserPreferences, PrepType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Titolo accattivante della ricetta" },
    tagline: { type: Type.STRING, description: "Breve frase emozionale sulla ricetta" },
    timeMinutes: { type: Type.INTEGER, description: "Tempo totale in minuti" },
    ingredientCount: { type: Type.INTEGER, description: "Numero totale di ingredienti" },
    stepCount: { type: Type.INTEGER, description: "Numero totale di passaggi" },
    difficulty: { type: Type.STRING, enum: ["Facile", "Media", "Difficile"] },
    rating: { type: Type.NUMBER, description: "Rating tra 4.5 e 5.0" },
    ingredientsList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING }
        }
      }
    },
    toolsList: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista di 3-5 utensili da cucina comuni e semplici necessari (es. pentolino, cucchiaio, tazza, colino)"
    },
    benefits: { type: Type.STRING, description: "Spiegazione di 2-3 frasi sui benefici" },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          instruction: { type: Type.STRING, description: "Istruzione DETTAGLIATA che include quantità e strumenti." },
          tip: { type: Type.STRING, description: "Consiglio opzionale pratico", nullable: true }
        }
      }
    }
  },
  required: ["title", "tagline", "timeMinutes", "difficulty", "ingredientsList", "toolsList", "benefits", "steps"]
};

// Fallback images if generation fails (High quality, colorful, herbal themes)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1000&auto=format&fit=crop", // Tea pouring
  "https://images.unsplash.com/photo-1515541335405-f33c91967405?q=80&w=1000&auto=format&fit=crop", // Dried herbs
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=1000&auto=format&fit=crop", // Green leaves/mortar
  "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=1000&auto=format&fit=crop"  // Essential oils/bottles
];

export const generateRecipe = async (prefs: UserPreferences, previousRecipe?: Recipe | null): Promise<Recipe> => {
  
  // Costruiamo il contesto di variazione se esiste una ricetta precedente
  let variationContext = "";
  if (previousRecipe) {
    const prevIngredients = previousRecipe.ingredientsList.map(i => i.name).join(', ');
    variationContext = `
    CONTESTO VARIAZIONE (IMPORTANTE):
    L'utente ha scartato la ricetta precedente: "${previousRecipe.title}" (Ingredienti usati: ${prevIngredients}).
    OBIETTIVO: Devi proporre qualcosa di DIVERSO.
    1. CAMBIA INGREDIENTI: Analizza a fondo la lista "Dispensa". Cerca combinazioni alternative che non hai usato prima. Non usare sempre i soliti (es. se hai usato zenzero prima, ora prova menta o finocchio se disponibili).
    2. Se gli ingredienti sono finiti o gli altri non sono adatti, CAMBIA LA TECNICA o il FORMATO (es. se era un infuso, fai un decotto più concentrato o aggiungi un grasso veicolante come il miele in modo diverso).
    `;
  }

  const prompt = `
    Agisci come un esperto naturopata ed erborista creativo.
    
    PARAMETRI UTENTE:
    - Sintomi: ${prefs.symptoms.join(', ')}
    - Tipo preparato: ${prefs.prepType}
    - Dispensa COMPLETA (Ingredienti): ${prefs.ingredients.join(', ')}
    - Tempo a disposizione: ${prefs.time}

    ${variationContext}

    LOGICA DI SELEZIONE INGREDIENTI:
    - Analizza l'INTERA lista di ingredienti disponibili.
    - Se ci sono molti ingredienti, cerca di usarne almeno 3-4 per creare una sinergia complessa, invece che solo 1 o 2.
    - Cerca combinazioni creative ma sicure.

    LOGICA DI DIFFERENZIAZIONE TEMPO/DIFFICOLTÀ:
    Devi adattare drasticamente la complessità in base al tempo indicato:

    1. SE "Veloce (< 10 min)" -> DIFFICOLTÀ: "Facile"
       - Usa 2-3 ingredienti massimi. Procedura "One-pot".
       
    2. SE "Normale (10-20 min)" -> DIFFICOLTÀ: "Media"
       - Crea una sinergia di 3-4 ingredienti. Inserisci passaggi di preparazione (pestare, grattugiare, sciogliere a parte).
       
    3. SE "Ho tempo (> 20 min)" -> DIFFICOLTÀ: "Difficile" (o Media complessa)
       - Crea una "Pozione Maestra". Usa 4+ ingredienti se disponibili per uno spettro d'azione completo.
       - Sfrutta tempi di estrazione diversi o preparazioni a stadi.

    REGOLE PER I PASSAGGI (STEPS):
    1. Raggruppa tutto in 3-4 MACRO-PASSAGGI densi di istruzioni.
    2. In OGNI testo del passaggio, devi citare ESPLICITAMENTE le quantità e gli strumenti.
    3. Usa SOLO gli ingredienti disponibili (più acqua/basi comuni).
    4. Includi "toolsList".

    Tono: Caldo, esperto, rassicurante.
    Lingua: Italiano.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        systemInstruction: "Sei un'app companion per un libro di rimedi naturali. Crea ricette sicure, efficaci e variegate."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const recipe = JSON.parse(text) as Recipe;
    // Inject prepType from preferences for context in image generation
    recipe.prepType = prefs.prepType;
    return recipe;

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};

export const generateRemedyImage = async (recipe: Recipe): Promise<string> => {
  // 1. Analyze specific ingredients for visual details to make it truly representative
  const mainIngredients = recipe.ingredientsList.map(i => i.name).join(', ');
  
  // 2. Determine container and texture based on PrepType
  let subjectDescription = "";
  let container = "";
  
  // Normalizing string for comparison
  const type = (recipe.prepType || "").toLowerCase();

  if (type.includes('sciroppo')) {
    subjectDescription = "thick, amber-colored syrup";
    container = "a vintage clear glass medicine bottle (unlabeled) or a silver spoon";
  } else if (type.includes('impacco') || type.includes('uso topico') || type.includes('crema')) {
    subjectDescription = "textured herbal paste or cream";
    container = "a small ceramic mortar or a wooden bowl";
  } else if (type.includes('decotto')) {
    subjectDescription = "dark, rich, concentrated herbal liquid";
    container = "a rustic ceramic mug";
  } else {
    // Default (Tisana/Infuso)
    subjectDescription = "translucent herbal tea with steam rising";
    container = "a clear double-walled glass cup";
  }

  // 3. Construct a specific, visual-only prompt. 
  // CRITICAL: We DO NOT include the recipe title to prevent text generation.
  const prompt = `
    Professional botanical still life photography. Macro shot, 8k resolution.

    SUBJECT:
    Center frame: ${container} filled with ${subjectDescription}.
    
    SURROUNDINGS:
    The container is sitting on an old textured wooden table.
    Artfully arranged around the container are fresh raw ingredients: ${mainIngredients}.
    Soft, natural window light (Golden Hour) illuminating the steam or texture.
    
    STYLE:
    - Editorial nature photography.
    - Cinematic depth of field (bokeh background).
    - Warm, organic, healing atmosphere.
    
    NEGATIVE PROMPT (STRICT):
    - NO TEXT.
    - NO LABELS on bottles or jars.
    - NO WRITING.
    - NO WATERMARKS.
    - NO plastic.
    - NO cartoon or illustration style.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a random high-quality fallback image
    const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
    return FALLBACK_IMAGES[randomIndex];
  }
};