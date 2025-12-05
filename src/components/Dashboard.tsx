import React from 'react';
import { UserProfile, DailyLog } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Droplet, Flame, Utensils, AlertCircle } from 'lucide-react';

interface Props {
  profile: UserProfile;
  dailyLog: DailyLog;
  onUpdateWater: (amount: number) => void;
}

const Dashboard: React.FC<Props> = ({ profile, dailyLog, onUpdateWater }) => {
  const caloriesConsumed = dailyLog.meals.reduce((acc, meal) => acc + meal.calories, 0);
  const caloriesRemaining = Math.max(0, profile.dailyCaloriesTarget - caloriesConsumed);
  
  const progressData = [
    { name: 'Consumido', value: caloriesConsumed },
    { name: 'Restante', value: caloriesRemaining },
  ];
  const COLORS = ['#10b981', '#e5e7eb']; // Emerald-500 vs Gray-200

  const waterCups = Math.round(dailyLog.waterConsumed / 250);
  const targetCups = Math.ceil(profile.waterTarget / 250);

  return (
    <div className="p-4 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Olá, {profile.name}! 👋</h1>
        <p className="text-gray-500 text-sm">Vamos focar em {profile.goal} hoje.</p>
      </header>

      {/* Calorie Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center relative">
        <h2 className="text-lg font-semibold text-gray-700 w-full flex items-center gap-2 mb-2">
          <Flame className="text-orange-500" /> Calorias do Dia
        </h2>
        <div className="h-48 w-full relative">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {progressData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-800">{caloriesConsumed}</span>
            <span className="text-xs text-gray-400">de {profile.dailyCaloriesTarget} kcal</span>
          </div>
        </div>
        <div className="w-full flex justify-between mt-4 px-4">
           <div className="text-center">
             <p className="text-xs text-gray-400">Proteína</p>
             <p className="font-semibold text-gray-700">{Math.round(dailyLog.meals.reduce((a,m)=>a+m.protein,0))}g</p>
           </div>
           <div className="text-center">
             <p className="text-xs text-gray-400">Carbos</p>
             <p className="font-semibold text-gray-700">{Math.round(dailyLog.meals.reduce((a,m)=>a+m.carbs,0))}g</p>
           </div>
           <div className="text-center">
             <p className="text-xs text-gray-400">Gorduras</p>
             <p className="font-semibold text-gray-700">{Math.round(dailyLog.meals.reduce((a,m)=>a+m.fats,0))}g</p>
           </div>
        </div>
      </div>

      {/* Water Card */}
      <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <Droplet className="text-blue-500" /> Hidratação
            </h2>
            <p className="text-sm text-blue-700 mt-1">
              {dailyLog.waterConsumed}ml / {profile.waterTarget}ml
            </p>
          </div>
          <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-500 shadow-sm">
            {waterCups}/{targetCups} copos
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from({ length: Math.min(targetCups + 2, 12) }).map((_, idx) => (
             <div 
               key={idx} 
               className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${idx < waterCups ? 'bg-blue-500 text-white shadow-md scale-110' : 'bg-blue-200/50 text-blue-300'}`}
             >
               <Droplet size={14} fill={idx < waterCups ? "currentColor" : "none"} />
             </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => onUpdateWater(250)}
            className="flex-1 bg-white hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-lg text-sm border border-blue-200 transition-colors"
          >
            + 1 Copo (250ml)
          </button>
          <button 
            onClick={() => onUpdateWater(-250)}
            className="w-12 flex items-center justify-center bg-white hover:bg-blue-100 text-blue-400 font-semibold py-2 rounded-lg text-sm border border-blue-200 transition-colors"
          >
            -
          </button>
        </div>
      </div>

      {/* Meals Summary */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Utensils className="text-emerald-500" /> Refeições de Hoje
        </h2>
        {dailyLog.meals.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-sm">Nenhuma refeição registrada ainda.</p>
            <p className="text-emerald-600 text-xs mt-1 font-medium">Use a câmera para adicionar! 📸</p>
          </div>
        ) : (
          dailyLog.meals.map((meal, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
              {meal.imageUrl && (
                <img src={meal.imageUrl} alt={meal.foodName} className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 text-sm">{meal.foodName}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meal.healthScore >= 7 ? 'bg-green-100 text-green-700' : meal.healthScore >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    Nota {meal.healthScore}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{meal.calories} kcal • P: {meal.protein}g C: {meal.carbs}g G: {meal.fats}g</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex gap-3 items-start">
         <AlertCircle className="text-yellow-600 shrink-0" size={20} />
         <p className="text-xs text-yellow-800">
           <strong>Lembrete:</strong> NutriAppBR AI é uma ferramenta de auxílio. Consulte sempre um nutricionista profissional para orientações médicas.
         </p>
      </div>
    </div>
  );
};

export default Dashboard;