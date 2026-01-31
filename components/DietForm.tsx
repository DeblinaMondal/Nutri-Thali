import React, { useState } from 'react';
import { UserProfile, HEALTH_CONDITIONS_LIST } from '../types';
import { ChevronRight, Check, Activity, Utensils, HeartPulse, User } from 'lucide-react';

interface DietFormProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'];

const DietForm: React.FC<DietFormProps> = ({ userProfile, setUserProfile, onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleTasteChange = (field: keyof UserProfile['tastePreferences'], value: number) => {
    setUserProfile(prev => ({
      ...prev,
      tastePreferences: { ...prev.tastePreferences, [field]: value }
    }));
  };

  const toggleCondition = (condition: string) => {
    setUserProfile(prev => {
      const current = prev.healthConditions;
      if (condition === 'None') return { ...prev, healthConditions: ['None'] };
      
      let newConditions;
      if (current.includes(condition)) {
        newConditions = current.filter(c => c !== condition);
      } else {
        newConditions = [...current.filter(c => c !== 'None'), condition];
      }
      return { ...prev, healthConditions: newConditions };
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const steps = [
    { id: 1, title: "Personal Details", icon: User },
    { id: 2, title: "Health & Goals", icon: HeartPulse },
    { id: 3, title: "Food Preferences", icon: Utensils },
    { id: 4, title: "Lifestyle", icon: Activity },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors duration-300">
      {/* Progress Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className={`flex flex-col items-center ${step === s.id ? 'opacity-100' : 'opacity-40'} transition-opacity`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm font-bold transition-colors ${isActive || isDone ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                {isDone ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400 hidden sm:block">{s.title}</span>
            </div>
          )
        })}
      </div>

      <div className="p-6 sm:p-8">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tell us about yourself</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <select 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={userProfile.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={userProfile.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Height (cm)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={userProfile.height}
                  onChange={(e) => handleChange('height', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={userProfile.weight}
                  onChange={(e) => handleChange('weight', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Health Conditions & Goals */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Health & Objectives</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Health Conditions (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {HEALTH_CONDITIONS_LIST.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => toggleCondition(condition)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      userProfile.healthConditions.includes(condition)
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Goal</label>
              <select 
                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                value={userProfile.primaryGoal}
                onChange={(e) => handleChange('primaryGoal', e.target.value)}
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Muscle Building">Muscle Building</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Blood Sugar Control">Blood Sugar Control</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Food Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Kitchen Preferences</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diet Type</label>
                <select 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={userProfile.dietType}
                  onChange={(e) => handleChange('dietType', e.target.value)}
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Cuisine</label>
                <input 
                  type="text"
                  placeholder="e.g. South Indian, Mediterranean"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                  value={userProfile.cuisinePreference}
                  onChange={(e) => handleChange('cuisinePreference', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
               <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Taste Profile (1-5)</label>
               <div className="space-y-4">
                  {[
                    { label: 'Sweetness', key: 'sweetness' },
                    { label: 'Spiciness', key: 'spiciness' },
                    { label: 'Bitterness', key: 'bitterness' }
                  ].map((taste) => (
                    <div key={taste.key} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-slate-600 dark:text-slate-400">{taste.label}</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-600"
                        value={userProfile.tastePreferences[taste.key as keyof typeof userProfile.tastePreferences]}
                        onChange={(e) => handleTasteChange(taste.key as any, parseInt(e.target.value))}
                      />
                      <span className="w-8 text-center text-sm font-bold text-teal-700 dark:text-teal-400">
                        {userProfile.tastePreferences[taste.key as keyof typeof userProfile.tastePreferences]}
                      </span>
                    </div>
                  ))}
               </div>
            </div>
            
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Oil Usage Preference</label>
               <div className="flex gap-4">
                 {['Low', 'Medium', 'High'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="oil" 
                        value={opt}
                        checked={userProfile.oilPreference === opt}
                        onChange={(e) => handleChange('oilPreference', e.target.value)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{opt}</span>
                    </label>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Step 4: Lifestyle & Review */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Final Touches</h2>
             
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Activity Level</label>
                <select 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                  value={userProfile.activityLevel}
                  onChange={(e) => handleChange('activityLevel', e.target.value)}
                >
                  <option value="Sedentary">Sedentary (Little or no exercise)</option>
                  <option value="Lightly Active">Lightly Active (Exercise 1-3 days/week)</option>
                  <option value="Moderately Active">Moderately Active (Exercise 3-5 days/week)</option>
                  <option value="Highly Active">Highly Active (Exercise 6-7 days/week)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget</label>
                  <select 
                    className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                    value={userProfile.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                  >
                    <option value="Economy">Economy (Budget-Friendly)</option>
                    <option value="Standard">Standard (Balanced)</option>
                    <option value="Premium">Premium (High Quality)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                  <select 
                    className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-colors"
                    value={userProfile.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                  >
                    {CURRENCIES.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plan Duration</label>
                <div className="flex gap-4">
                  {['7 Days', '30 Days'].map((d) => (
                    <button
                      key={d}
                      onClick={() => handleChange('planDuration', d)}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all ${
                        userProfile.planDuration === d 
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' 
                        : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Any Additional Notes? (Allergies, dislikes, etc.)</label>
                <textarea 
                  rows={3}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none resize-none text-slate-900 dark:text-white transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="e.g. I hate mushrooms, I love spicy food..."
                  value={userProfile.additionalNotes}
                  onChange={(e) => handleChange('additionalNotes', e.target.value)}
                />
              </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-between transition-colors">
        {step > 1 ? (
          <button 
            onClick={prevStep}
            className="px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        {step < 4 ? (
          <button 
            onClick={nextStep}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-lg shadow-teal-200 dark:shadow-teal-900/50 transition-all flex items-center gap-2"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            onClick={onSubmit}
            disabled={isLoading}
            className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-lg shadow-teal-200 dark:shadow-teal-900/50 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating Plan...' : 'Generate My Plan'}
            {!isLoading && <Activity size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default DietForm;