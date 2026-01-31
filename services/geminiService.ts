import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, DietPlanResponse } from "../types";

export const generateDietPlan = async (userProfile: UserProfile): Promise<DietPlanResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an advanced AI Diet Planner Application Engine.
    Your role is to function as the complete backend intelligence of a Diet Planner App.
    Behave like an app, not a chatbot. Tone: Friendly, Clear, Encouraging.

    INTELLIGENCE RULES:
    • Adjust calories based on age, gender, weight, activity level, and goal
    • Control carbohydrates strictly for diabetics
    • Avoid high-GI foods for blood sugar control
    • Avoid lactose for lactose intolerance
    • Avoid gluten for gluten intolerance
    • Prefer hormone-supportive foods for PCOS/thyroid
    • Respect taste tolerance (e.g., low sweetness = no sugary foods)
    • Respect budget constraints strictly.
    • Prefer home-cooked, simple meals
    • Offer food substitutions when possible
    • Include affordable alternatives when ingredients are expensive
    • Include a "lazy cooking" option (≤15 min meals) when appropriate
    • Include one flexible / eating-out-friendly meal per week
    • Default to Indian foods unless specified otherwise.
  `;

  const prompt = `
    Generate a ${userProfile.planDuration} diet plan based on the following user profile:

    Gender: ${userProfile.gender}
    Age: ${userProfile.age}
    Height: ${userProfile.height} cm
    Weight: ${userProfile.weight} kg
    Health Conditions: ${userProfile.healthConditions.join(', ')}
    Diet Type: ${userProfile.dietType}
    Taste Preferences (1-5): Sweetness ${userProfile.tastePreferences.sweetness}, Spiciness ${userProfile.tastePreferences.spiciness}, Bitterness ${userProfile.tastePreferences.bitterness}
    Oil Preference: ${userProfile.oilPreference}
    Cuisine Preference: ${userProfile.cuisinePreference}
    Activity Level: ${userProfile.activityLevel}
    Primary Goal: ${userProfile.primaryGoal}
    Budget Level: ${userProfile.budget}
    Currency for estimates: ${userProfile.currency}
    Additional Notes: ${userProfile.additionalNotes || 'None'}

    Please provide the output in the strict JSON format defined by the schema.

    CRITICAL INSTRUCTION FOR DURATION:
    If the plan is '30 Days', you MUST generate 28 distinct daily plans (4 weeks) inside the 'dailyPlan' array. Label them Day 1 through Day 28. Do not summarize or provide a 7-day loop.
    If the plan is '7 Days', generate 7 distinct daily plans.
  `;

  const mealSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the dish" },
      portion: { type: Type.STRING, description: "Quantity/Portion size" },
      notes: { type: Type.STRING, description: "Brief cooking or prep note" },
    },
    required: ["name", "portion", "notes"],
  };

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      userSummary: {
        type: Type.OBJECT,
        properties: {
          highlights: { type: Type.STRING, description: "Key profile highlights" },
          goalApproach: { type: Type.STRING, description: "Goal and calorie approach (low / moderate / aggressive)" },
          calorieTarget: { type: Type.STRING, description: "Daily calorie target range" },
        },
        required: ["highlights", "goalApproach", "calorieTarget"],
      },
      nutritionStrategy: {
        type: Type.OBJECT,
        properties: {
          proteinFocus: { type: Type.STRING },
          carbControl: { type: Type.STRING },
          fatSources: { type: Type.STRING },
          hydration: { type: Type.STRING },
        },
        required: ["proteinFocus", "carbControl", "fatSources", "hydration"],
      },
      dailyPlan: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING, description: "Day 1, Day 2, etc." },
            breakfast: mealSchema,
            midMorning: mealSchema,
            lunch: mealSchema,
            eveningSnack: mealSchema,
            dinner: mealSchema,
          },
          required: ["day", "breakfast", "midMorning", "lunch", "eveningSnack", "dinner"],
        },
      },
      smartSwaps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "e.g., Breakfast, Snacks" },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["category", "options"],
        },
      },
      groceryList: {
        type: Type.OBJECT,
        properties: {
          grains: { type: Type.ARRAY, items: { type: Type.STRING } },
          proteins: { type: Type.ARRAY, items: { type: Type.STRING } },
          vegetables: { type: Type.ARRAY, items: { type: Type.STRING } },
          fruits: { type: Type.ARRAY, items: { type: Type.STRING } },
          fats: { type: Type.ARRAY, items: { type: Type.STRING } },
          spices: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["grains", "proteins", "vegetables", "fruits", "fats", "spices"],
      },
      conditionSpecificNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
      habitCoaching: { type: Type.ARRAY, items: { type: Type.STRING } },
      disclaimer: { type: Type.STRING },
    },
    required: [
      "userSummary",
      "nutritionStrategy",
      "dailyPlan",
      "smartSwaps",
      "groceryList",
      "conditionSpecificNotes",
      "habitCoaching",
      "disclaimer",
    ],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DietPlanResponse;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};