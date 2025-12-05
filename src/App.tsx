import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, MealAnalysis } from './types';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import MealAnalyzer from './components/MealAnalyzer';
import DietPlanner from './components/DietPlanner';
import { getTodayString } from './utils/calculations';
import { LayoutDashboard, Camera, ChefHat, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: getTodayString(),
    meals: [],
    waterConsumed: 0
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'food' | 'diet' | 'profile'>('dashboard');

  // Load data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('nutri_profile');
    const savedLog = localStorage.getItem(`nutri_log_${getTodayString()}`);
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    if (savedLog) {
      setDailyLog(JSON.parse(savedLog));
    }
  }, []);

  // Save data on change
  useEffect(() => {
    if (profile) {
      localStorage.setItem('nutri_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (profile) { // Only save log if profile exists
      localStorage.setItem(`nutri_log_${dailyLog.date}`, JSON.stringify(dailyLog));
    }
  }, [dailyLog, profile]);

  const handleProfileSave = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setActiveTab('dashboard');
  };

  const handleAddMeal = (meal: MealAnalysis) => {
    setDailyLog(prev => ({
      ...prev,
      meals: [meal, ...prev.meals]
    }));
    setActiveTab('dashboard');
  };

  const handleUpdateWater = (amount: number) => {
    setDailyLog(prev => ({
      ...prev,
      waterConsumed: Math.max(0, prev.waterConsumed + amount)
    }));
  };

  const handleClearData = () => {
    if(confirm("Tem certeza que deseja apagar seus dados?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!profile) {
    return <ProfileSetup onSave={handleProfileSave} />;
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden">
      
      {/* Content Area */}
      <div className="h-full overflow-y-auto no-scrollbar">
        {activeTab === 'dashboard' && (
          <Dashboard 
            profile={profile} 
            dailyLog={dailyLog} 
            onUpdateWater={handleUpdateWater} 
          />
        )}
        {activeTab === 'food' && (
          <MealAnalyzer 
            isVegan={profile.isVegan} 
            onAddMeal={handleAddMeal} 
            onCancel={() => setActiveTab('dashboard')} 
          />
        )}
        {activeTab === 'diet' && (
          <DietPlanner profile={profile} />
        )}
        {activeTab === 'profile' && (
          <div className="p-6 pb-24 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
            <div className="bg-white p-4 rounded-xl shadow border border-gray-100 space-y-2">
              <p><span className="font-semibold text-gray-500">Nome:</span> {profile.name}</p>
              <p><span className="font-semibold text-gray-500">Meta:</span> {profile.goal}</p>
              <p><span className="font-semibold text-gray-500">Calorias:</span> {profile.dailyCaloriesTarget} kcal</p>
              <p><span className="font-semibold text-gray-500">Água:</span> {profile.waterTarget} ml</p>
            </div>
            <button 
              onClick={() => setProfile(null)} // Re-edit
              className="w-full bg-emerald-100 text-emerald-700 font-bold py-3 rounded-lg"
            >
              Editar Dados
            </button>
             <button 
              onClick={handleClearData}
              className="w-full bg-red-50 text-red-600 font-medium py-3 rounded-lg text-sm"
            >
              Resetar Tudo (Cuidado)
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Diário</span>
        </button>

        <button 
          onClick={() => setActiveTab('diet')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'diet' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <ChefHat size={24} strokeWidth={activeTab === 'diet' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Dieta</span>
        </button>

        <button 
          onClick={() => setActiveTab('food')}
          className="relative -top-6 bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
        >
          <Camera size={28} />
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <UserCircle size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default App;