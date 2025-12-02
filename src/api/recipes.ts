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
  export interface reciperesponse{
    status:string;
    payload:Recipe[];
  }
  export const getrecipes= async():Promise<reciperesponse>=>{
    const response=await api.get<reciperesponse>('v0.1/user/recipes');
    return response.data;
  }