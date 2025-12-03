import api from "./axios";

export interface Recipe {
      id: number;
      user_id:number;
      title: string;
      instruction: string;
      tags:string;
      created_at: string;
      updated_at: string;
  };
  export interface MealPlan {
    id: number;
    household_id:number;
    created_by:number;
    name: string;
    start_date: string;
    created_at: string;
    updated_at: string;
};
export interface mealplanresponse{
  status:string;
  payload:MealPlan[];
}
export const getmeals= async():Promise<mealplanresponse>=>{
  const response=await api.get<mealplanresponse>('v0.1/user/meal_plans');
  return response.data;
}
  export interface reciperesponse{
    status:string;
    payload:Recipe[];
  }
  export const getrecipes= async():Promise<reciperesponse>=>{
    const response=await api.get<reciperesponse>('v0.1/user/recipes');
    return response.data;
  }