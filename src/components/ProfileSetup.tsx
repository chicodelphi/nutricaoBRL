import React, { useState } from 'react';
import { ActivityLevel, Gender, Goal, UserProfile } from '../types';
import { calculateNeeds } from '../utils/calculations';
import { Activity, User, Target, ChevronRight } from 'lucide-react';

interface Props {
  onSave: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<Props> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: Gender.MALE,
    activityLevel: ActivityLevel.SEDENTARY,
    goal: Goal.LOSE_WEIGHT,
    isVegan: false
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinish = () => {
    const age = parseInt(formData.age) || 25;
    const weight = parseFloat(formData.weight) || 70;
    const height = parseFloat(formData.height) || 170;

    const { tmb, dailyCalories, waterTarget } = calculateNeeds(
      age, weight, height, formData.gender, formData.activityLevel, formData.goal
    );

    const profile: UserProfile = {
      name: formData.name,
      age,
      weight,
      height,
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      isVegan: formData.isVegan,
      tmb,
      dailyCaloriesTarget: dailyCalories,
      waterTarget
    };

    onSave(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">NutriAppBR AI 🥑</h1>
          <p className="text-gray-500">Vamos montar seu perfil saudável!</p>
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold flex items-center gap-2"><User size={20}/> Sobre Você</h2>
            <input
              type="text"
              placeholder="Seu nome"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Idade (anos)"
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
              <select
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value as Gender)}
              >
                <option value={Gender.MALE}>Masculino</option>
                <option value={Gender.FEMALE}>Feminino</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <input
                type="number"
                placeholder="Peso (kg)"
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
              <input
                type="number"
                placeholder="Altura (cm)"
                className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
             <button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.age || !formData.weight}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Próximo <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Activity size={20}/> Estilo de Vida</h2>
            
            <label className="block text-sm font-medium text-gray-700">Nível de Atividade</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={formData.activityLevel}
              onChange={(e) => handleChange('activityLevel', e.target.value as ActivityLevel)}
            >
              {Object.values(ActivityLevel).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700">Objetivo</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              value={formData.goal}
              onChange={(e) => handleChange('goal', e.target.value as Goal)}
            >
              {Object.values(Goal).map(goal => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <input
                type="checkbox"
                id="vegan"
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                checked={formData.isVegan}
                onChange={(e) => handleChange('isVegan', e.target.checked)}
              />
              <label htmlFor="vegan" className="font-medium text-green-800">Sou vegano(a) 🌱</label>
            </div>

            <div className="flex gap-3">
               <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Começar! <Target size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;