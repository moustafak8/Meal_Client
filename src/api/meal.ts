import api from "./axios";
import type { mealplanresponse } from "./recipes";
export interface MealPlanEntries{
    id: number;
    meal_plan_id:number;
    recipe_id:number;
    date:string;
    meal_type:string;
    description:string;
  }
  export interface MealPlanEntryResponse{
    status:string;
    payload:MealPlanEntries[];
  }
  export interface MealPlan {
    id: number;
    household_id:number;
    created_by:number;
    name: string;
    start_date: string;
    created_at: string;
    updated_at: string;
};
  export interface MealPlanResponse{
    status:string;
    payload:MealPlan[];
  }
  export const addMealPlan= async(body:MealPlan):Promise<MealPlanResponse>=>{
    const response=await api.post<MealPlanResponse>('v0.1/user/add_update_meal_plan/add',body);
    return response.data;
  }
  export const getMealPlanEntries= async(meal_plan_id:number):Promise<MealPlanEntryResponse>=>{
    const response=await api.get<MealPlanEntryResponse>(`v0.1/user/meal_plan_entries/${meal_plan_id}`);
    return response.data;
  }
  export const addMealPlanEntry= async(body:MealPlanEntries):Promise<MealPlanEntryResponse>=>{
    const response=await api.post<MealPlanEntryResponse>('v0.1/user/add_update_meal_plan_entry/add',body);
    return response.data;
  }
 