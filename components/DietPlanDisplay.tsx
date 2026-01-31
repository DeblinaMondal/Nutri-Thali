import React, { useState } from 'react';
import { DietPlanResponse, DayPlan } from '../types';
import { 
  Leaf, 
  Flame, 
  Droplets, 
  Beef, 
  RefreshCw, 
  ShoppingCart, 
  Info, 
  CheckCircle2,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DietPlanDisplayProps {
  plan: DietPlanResponse;
  onReset: () => void;
}

const COLORS = ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

const DietPlanDisplay: React.FC<DietPlanDisplayProps> = ({ plan, onReset }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'grocery' | 'insights'>('schedule');
  const [expandedDay, setExpandedDay] = useState<string | null>(plan.dailyPlan[0]?.day || null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Extract simulated macro percentages for visualization (purely illustrative based on standard diet types)
  const macroData = [
    { name: 'Protein', value: 30 },
    { name: 'Carbs', value: 40 },
    { name: 'Fats', value: 30 },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border-l-8 border-teal-500 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-teal-900 dark:text-teal-100">
           <Leaf size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
             <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Personalized Plan</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{plan.userSummary.highlights}</p>
             </div>
             <div className="flex gap-2">
               <button 
                  onClick={onReset}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                >
                  Start Over
               </button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-xl border border-teal-100 dark:border-teal-800">
              <div className="flex items-center gap-2 mb-2 text-teal-800 dark:text-teal-200 font-bold">
                <Flame size={18} /> Target Intake
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{plan.userSummary.calorieTarget}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide font-semibold">{plan.userSummary.goalApproach}</p>
            </div>
             <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2 text-blue-800 dark:text-blue-200 font-bold">
                <Droplets size={18} /> Hydration
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{plan.nutritionStrategy.hydration}</p>
            </div>
             <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-200 font-bold">
                <Beef size={18} /> Protein Focus
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{plan.nutritionStrategy.proteinFocus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex justify-center space-x-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        {[
          { id: 'schedule', label: 'Daily Schedule', icon: Calendar },
          { id: 'grocery', label: 'Grocery List', icon: ShoppingCart },
          { id: 'insights', label: 'Strategy & Habits', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* CONTENT: SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4 animate-fadeIn">
          {plan.dailyPlan.map((day, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-100 dark:border-slate-700 transition-all hover:shadow-lg">
              <button 
                onClick={() => toggleDay(day.day)}
                className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${expandedDay === day.day ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{day.day}</h3>
                </div>
                {expandedDay === day.day ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>

              {expandedDay === day.day && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="space-y-6">
                    {[
                      { label: 'Breakfast', data: day.breakfast },
                      { label: 'Mid-Morning', data: day.midMorning },
                      { label: 'Lunch', data: day.lunch },
                      { label: 'Evening Snack', data: day.eveningSnack },
                      { label: 'Dinner', data: day.dinner },
                    ].map((meal, mIdx) => (
                      <div key={mIdx} className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-teal-500"></div>
                        <h4 className="text-xs font-bold uppercase text-teal-600 dark:text-teal-400 tracking-wider mb-1">{meal.label}</h4>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                           <h5 className="font-bold text-slate-800 dark:text-slate-100">{meal.data.name}</h5>
                           <p className="text-sm text-slate-600 dark:text-slate-300 mt-1"><span className="font-semibold text-slate-900 dark:text-white">Portion:</span> {meal.data.portion}</p>
                           <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic flex items-start gap-2">
                             <Info size={14} className="mt-1 flex-shrink-0" /> {meal.data.notes}
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Smart Swaps */}
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-100 dark:border-slate-700">
             <div className="flex items-center gap-2 mb-4">
               <RefreshCw className="text-teal-600 dark:text-teal-400" />
               <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Smart Swaps</h3>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {plan.smartSwaps.map((swap, idx) => (
                 <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide mb-2">{swap.category}</h4>
                    <ul className="space-y-2">
                      {swap.options.map((opt, oIdx) => (
                        <li key={oIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle2 size={14} className="mt-1 text-teal-500 dark:text-teal-400 flex-shrink-0" />
                          {opt}
                        </li>
                      ))}
                    </ul>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* CONTENT: GROCERY */}
      {activeTab === 'grocery' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 animate-fadeIn border border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <ShoppingCart className="text-teal-600 dark:text-teal-400" /> Your Shopping List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(plan.groceryList).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 capitalize mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">{category}</h3>
                <ul className="space-y-2">
                  {(items as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center group-hover:border-teal-500 transition-colors">
                        <div className="w-3 h-3 rounded-sm bg-teal-500 opacity-0 group-hover:opacity-20 dark:group-hover:opacity-60"></div>
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT: INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strategy Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 w-full text-left">Nutrition Balance</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-slate-400 mt-2">*Visualization estimate based on {plan.userSummary.goalApproach} goal.</p>
            </div>

            {/* Habit Coaching */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Daily Habit Coaching</h3>
              <div className="space-y-4">
                {plan.habitCoaching.map((habit, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg">
                    <div className="bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-100 font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">{idx + 1}</div>
                    <p className="text-sm text-teal-900 dark:text-teal-100 font-medium">{habit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Condition Notes */}
          {plan.conditionSpecificNotes.length > 0 && (
             <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-800">
               <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                 <AlertCircle size={20} /> Health Considerations
               </h3>
               <ul className="list-disc list-inside space-y-2">
                 {plan.conditionSpecificNotes.map((note, idx) => (
                   <li key={idx} className="text-sm text-red-900 dark:text-red-200">{note}</li>
                 ))}
               </ul>
             </div>
          )}

           {/* Disclaimer */}
           <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Medical Disclaimer</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{plan.disclaimer}</p>
           </div>
        </div>
      )}

    </div>
  );
};

export default DietPlanDisplay;