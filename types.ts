export interface UserProfile {
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  height: number; // cm
  weight: number; // kg
  healthConditions: string[];
  dietType: 'Vegetarian' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian';
  tastePreferences: {
    sweetness: number;
    spiciness: number;
    bitterness: number;
  };
  oilPreference: 'Low' | 'Medium' | 'High';
  cuisinePreference: string;
  activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Highly Active';
  primaryGoal: 'Weight Loss' | 'Weight Gain' | 'Muscle Building' | 'Maintenance' | 'Blood Sugar Control';
  planDuration: '7 Days' | '30 Days';
  budget: 'Economy' | 'Standard' | 'Premium';
  currency: string;
  additionalNotes: string;
}

export interface Meal {
  name: string;
  portion: string;
  notes: string;
}

export interface DayPlan {
  day: string;
  breakfast: Meal;
  midMorning: Meal;
  lunch: Meal;
  eveningSnack: Meal;
  dinner: Meal;
}

export interface SmartSwap {
  category: string;
  options: string[];
}

export interface DietPlanResponse {
  userSummary: {
    highlights: string;
    goalApproach: string;
    calorieTarget: string;
  };
  nutritionStrategy: {
    proteinFocus: string;
    carbControl: string;
    fatSources: string;
    hydration: string;
  };
  dailyPlan: DayPlan[];
  smartSwaps: SmartSwap[];
  groceryList: {
    grains: string[];
    proteins: string[];
    vegetables: string[];
    fruits: string[];
    fats: string[];
    spices: string[];
  };
  conditionSpecificNotes: string[];
  habitCoaching: string[];
  disclaimer: string;
}

export const INITIAL_USER_PROFILE: UserProfile = {
  gender: 'Female',
  age: 30,
  height: 165,
  weight: 65,
  healthConditions: [],
  dietType: 'Vegetarian',
  tastePreferences: {
    sweetness: 3,
    spiciness: 3,
    bitterness: 2,
  },
  oilPreference: 'Medium',
  cuisinePreference: 'Indian',
  activityLevel: 'Sedentary',
  primaryGoal: 'Weight Loss',
  planDuration: '7 Days',
  budget: 'Standard',
  currency: 'USD',
  additionalNotes: '',
};

export const HEALTH_CONDITIONS_LIST = [
  'None',
  'Diabetes',
  'Lactose Intolerance',
  'Gluten Intolerance',
  'PCOS',
  'Thyroid',
  'Hypertension',
];