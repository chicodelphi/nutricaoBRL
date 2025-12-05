export enum ActivityLevel {
  SEDENTARY = 'Sedentário (pouco ou nenhum exercício)',
  LIGHT = 'Levemente ativo (exercício leve 1-3 dias/semana)',
  MODERATE = 'Moderadamente ativo (exercício moderado 3-5 dias/semana)',
  ACTIVE = 'Muito ativo (exercício pesado 6-7 dias/semana)',
  VERY_ACTIVE = 'Extremamente ativo (trabalho físico ou treino muito pesado)'
}

export enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Feminino'
}

export enum Goal {
  LOSE_WEIGHT = 'Perder Peso',
  MAINTAIN = 'Manter Peso',
  GAIN_MUSCLE = 'Ganhar Massa Muscular'
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  isVegan: boolean;
  tmb: number; // Taxa Metabólica Basal
  dailyCaloriesTarget: number;
  waterTarget: number; // ml
}

export interface MealAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthScore: number; // 0-10
  feedback: string;
  timestamp: number;
  imageUrl?: string;
}

export interface DietMeal {
  name: string;
  description: string;
  calories: number;
}

export interface DietPlan {
  breakfast: DietMeal;
  morningSnack: DietMeal;
  lunch: DietMeal;
  afternoonSnack: DietMeal;
  dinner: DietMeal;
  tips: string[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: MealAnalysis[];
  waterConsumed: number; // ml
}