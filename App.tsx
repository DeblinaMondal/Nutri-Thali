import React, { useState, useEffect } from 'react';
import { UserProfile, DietPlanResponse, INITIAL_USER_PROFILE } from './types';
import { generateDietPlan } from './services/geminiService';
import DietForm from './components/DietForm';
import DietPlanDisplay from './components/DietPlanDisplay';
import { Sparkles, UtensilsCrossed, Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'nutrigen_user_profile_v1';
const THEME_KEY = 'nutrigen_theme_preference';

const App: React.FC = () => {
  // Initialize user profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        return { ...INITIAL_USER_PROFILE, ...JSON.parse(savedProfile) };
      }
    } catch (error) {
      console.error("Failed to load profile from local storage:", error);
    }
    return INITIAL_USER_PROFILE;
  });

  // Initialize Theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [dietPlan, setDietPlan] = useState<DietPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply Theme Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    } catch (error) {
      console.error("Failed to save profile to local storage:", error);
    }
  }, [userProfile]);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateDietPlan(userProfile);
      setDietPlan(plan);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the plan. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDietPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg text-white">
              <UtensilsCrossed size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              NutriGen AI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {dietPlan && (
               <span className="hidden sm:inline-block text-xs font-medium px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full border border-teal-100 dark:border-teal-800">
                  Powered by Gemini 2.0
               </span>
            )}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        
        {/* Loading Screen */}
        {loading && (
          <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-200 dark:border-slate-700 border-t-teal-500 dark:border-t-teal-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-teal-500 animate-pulse" size={32} />
              </div>
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-800 dark:text-slate-100">Designing Your Plan...</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-center max-w-md animate-pulse">
              Analyzing metabolism, calculating macros, and checking compatibility with your preferences.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
             <div className="text-red-500 mt-0.5">⚠️</div>
             <div>
               <h3 className="font-bold text-red-800 dark:text-red-300">Generation Failed</h3>
               <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
               <button 
                 onClick={() => setError(null)}
                 className="mt-2 text-xs font-bold text-red-800 dark:text-red-300 hover:text-red-900 dark:hover:text-red-200 underline"
               >
                 Dismiss
               </button>
             </div>
          </div>
        )}

        {/* Views */}
        {!dietPlan ? (
          <div className="animate-fadeIn">
             <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                  Your Smart AI Dietician
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                  Get a fully personalized 7 or 30-day meal plan tailored to your health conditions, taste, and goals in seconds.
                </p>
             </div>
             <DietForm 
                userProfile={userProfile} 
                setUserProfile={setUserProfile} 
                onSubmit={handleGeneratePlan}
                isLoading={loading}
             />
          </div>
        ) : (
          <DietPlanDisplay plan={dietPlan} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-8 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} NutriGen AI. Not a medical device. Consult a doctor before starting new diets.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;