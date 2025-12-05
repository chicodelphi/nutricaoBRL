import { ActivityLevel, Gender, Goal } from "../types";

export const calculateNeeds = (
  age: number,
  weight: number,
  height: number,
  gender: Gender,
  activity: ActivityLevel,
  goal: Goal
): { tmb: number; dailyCalories: number; waterTarget: number } => {
  
  // Harris-Benedict Revised
  let tmb = 0;
  if (gender === Gender.MALE) {
    tmb = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
  } else {
    tmb = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
  }

  let activityMultiplier = 1.2;
  switch (activity) {
    case ActivityLevel.SEDENTARY: activityMultiplier = 1.2; break;
    case ActivityLevel.LIGHT: activityMultiplier = 1.375; break;
    case ActivityLevel.MODERATE: activityMultiplier = 1.55; break;
    case ActivityLevel.ACTIVE: activityMultiplier = 1.725; break;
    case ActivityLevel.VERY_ACTIVE: activityMultiplier = 1.9; break;
  }

  let dailyCalories = tmb * activityMultiplier;

  // Goal Adjustment
  if (goal === Goal.LOSE_WEIGHT) {
    dailyCalories -= 500; // Deficit
  } else if (goal === Goal.GAIN_MUSCLE) {
    dailyCalories += 300; // Surplus
  }

  // Water: 35ml per kg
  const waterTarget = weight * 35;

  return {
    tmb: Math.round(tmb),
    dailyCalories: Math.round(dailyCalories),
    waterTarget: Math.round(waterTarget)
  };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};