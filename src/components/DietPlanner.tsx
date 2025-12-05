import React, { useState } from 'react';
import { UserProfile, DietPlan } from '../types';
import { generateDietPlan } from '../services/geminiService';
import { Loader2, Sparkles, Coffee, Sun, Moon, Utensils, RefreshCw } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

const DietPlanner: React.FC<Props> = ({ profile }) => {
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newPlan = await generateDietPlan(profile);
      setPlan(newPlan);
      // Save to local storage conceptually, or just state for now
    } catch (e) {
      alert("Erro ao gerar dieta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const MealCard = ({ title, meal, icon: Icon, colorClass }: any) => (
    <div className={`p-4 rounded-xl border ${colorClass} bg-white shadow-sm mb-4`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${colorClass.replace('border', 'bg').replace('200', '100')}`}>
          <Icon size={18} className="text-gray-700" />
        </div>
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <p className="font-semibold text-emerald-800 text-lg">{meal.name}</p>
      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{meal.description}</p>
      <p className="text-xs text-gray-400 font-medium mt-2 text-right">{meal.calories} kcal</p>
    </div>
  );

  return (
    <div className="p-4 pb-24 min-h-screen">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Plano Alimentar 🥗</h1>
          <p className="text-gray-500 text-sm">Feito sob medida pela IA.</p>
        </div>
        {plan && !loading && (
          <button onClick={handleGenerate} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <RefreshCw size={20} className="text-gray-600" />
          </button>
        )}
      </header>

      {!plan ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles size={48} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Seu plano ainda não existe</h2>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              Clique abaixo para que a IA crie um cardápio completo baseado no seu objetivo de {profile.goal}.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-200 transition-all flex items-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" /> Criando Mágica...</> : "Gerar Dieta Agora"}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in space-y-2">
           <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg mb-6">
             <h3 className="font-bold text-lg mb-1">Dicas do Nutri</h3>
             <ul className="list-disc list-inside text-sm space-y-1 opacity-90">
               {plan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
             </ul>
           </div>

           <MealCard title="Café da Manhã" meal={plan.breakfast} icon={Coffee} colorClass="border-orange-100" />
           <MealCard title="Lanche da Manhã" meal={plan.morningSnack} icon={Sun} colorClass="border-yellow-100" />
           <MealCard title="Almoço" meal={plan.lunch} icon={Utensils} colorClass="border-emerald-100" />
           <MealCard title="Lanche da Tarde" meal={plan.afternoonSnack} icon={Coffee} colorClass="border-orange-100" />
           <MealCard title="Jantar" meal={plan.dinner} icon={Moon} colorClass="border-indigo-100" />
        </div>
      )}
    </div>
  );
};

export default DietPlanner;