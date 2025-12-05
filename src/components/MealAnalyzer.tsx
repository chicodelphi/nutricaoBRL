import React, { useState, useRef } from 'react';
import { Camera, Check, Loader2, RefreshCw } from 'lucide-react';
import { analyzeFoodImage } from '../services/geminiService';
import { MealAnalysis } from '../types';
import { fileToBase64 } from '../utils/calculations';

interface Props {
  isVegan: boolean;
  onAddMeal: (meal: MealAnalysis) => void;
  onCancel: () => void;
}

const MealAnalyzer: React.FC<Props> = ({ isVegan, onAddMeal }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setImage(base64);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const analysis = await analyzeFoodImage(image, isVegan);
      setResult({ ...analysis, imageUrl: image });
    } catch (error) {
      alert("Ops! Não consegui analisar essa imagem. Tente outra vez.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (result) {
      onAddMeal(result);
    }
  };

  if (result) {
    return (
      <div className="p-4 flex flex-col h-full animate-fade-in pb-24">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           Resultado da Análise ✨
        </h2>
        
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden mb-6">
           <div className="relative h-48">
              <img src={image!} alt="Food" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                 <h3 className="text-white font-bold text-xl">{result.foodName}</h3>
              </div>
           </div>
           
           <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                 <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Calorias</p>
                    <p className="text-xl font-bold text-gray-800">{result.calories}</p>
                 </div>
                 <div className="h-8 w-px bg-gray-300"></div>
                 <div className="text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase">Saúde</p>
                    <div className={`text-xl font-bold ${result.healthScore >= 7 ? 'text-green-500' : 'text-orange-500'}`}>
                      {result.healthScore}/10
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                 <div className="bg-blue-50 p-2 rounded-lg">
                    <span className="block text-xs text-blue-400 font-bold">Prot</span>
                    <span className="text-blue-700 font-semibold">{result.protein}g</span>
                 </div>
                 <div className="bg-orange-50 p-2 rounded-lg">
                    <span className="block text-xs text-orange-400 font-bold">Carb</span>
                    <span className="text-orange-700 font-semibold">{result.carbs}g</span>
                 </div>
                 <div className="bg-yellow-50 p-2 rounded-lg">
                    <span className="block text-xs text-yellow-500 font-bold">Gord</span>
                    <span className="text-yellow-700 font-semibold">{result.fats}g</span>
                 </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                 <p className="text-sm text-emerald-800 italic">"{result.feedback}"</p>
              </div>
           </div>
        </div>

        <div className="flex gap-3 mt-auto">
          <button 
            onClick={() => { setResult(null); setImage(null); }}
            className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Descartar
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            Adicionar ao Diário <Check size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col h-full pb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Analisar Refeição 📸</h2>
      <p className="text-gray-500 mb-6">Tire uma foto do seu prato e deixe a IA calcular tudo.</p>

      <div 
        className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden"
        onClick={() => fileInputRef.current?.click()}
      >
        {image ? (
          <img src={image} alt="Preview" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} />
            </div>
            <p className="text-emerald-600 font-medium">Toque para abrir a câmera<br/>ou galeria</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          capture="environment" // Mobile camera preference
          onChange={handleFileChange}
        />
      </div>

      {image && (
        <div className="mt-6">
           <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Analisando...
              </>
            ) : (
              <>
                <RefreshCw /> Calcular Calorias
              </>
            )}
          </button>
          <button 
            onClick={() => setImage(null)}
            className="w-full mt-3 text-gray-500 text-sm font-medium py-2"
          >
            Escolher outra foto
          </button>
        </div>
      )}
    </div>
  );
};

export default MealAnalyzer;