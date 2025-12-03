import api from "./axios";
export interface ShoppingList{
    id:number;
    household_id:number;
    user_id:number;
    name:string;
    cost:number;
    status:string;
    created_at:string;
    updated_at:string;
}
export interface ShoppingListResponse{
    status:string;
    payload:ShoppingList[];
}
export const getShoppingList= async():Promise<ShoppingListResponse>=>{
    const response=await api.get<ShoppingListResponse>('v0.1/user/shopping_lists');
    return response.data;
}
export const addShoppingList= async(body:ShoppingList):Promise<ShoppingListResponse>=>{
    const response=await api.post<ShoppingListResponse>('v0.1/user/add_update_shopping_list/add',body);
    return response.data;
}