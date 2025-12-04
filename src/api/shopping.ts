import api from "./axios";
export interface ShoppingList{
    id:number;
    household_id:number;
    user_id:number;
    meal_plan_id:number|null;
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
export interface ShoppingListItems{
    id:number;
    shopping_list_id:number;
    name:string;
    unit_id:number;
    required_amount:number;
    isbought:boolean;
    created_at:string;
    updated_at:string;
}
export interface ShoppingListItemsResponse{
    status:string;
    payload:ShoppingListItems[];
}
export const getShoppingListItems= async(shopping_list_id:number):Promise<ShoppingListItemsResponse>=>{
    const response=await api.get<ShoppingListItemsResponse>(`v0.1/user/shopping_list_items/${shopping_list_id}`);
    return response.data;
}
export const addShoppingListItems= async(body:ShoppingListItems):Promise<ShoppingListItemsResponse>=>{
    const response=await api.post<ShoppingListItemsResponse>('v0.1/user/add_update_shopping_list_item/add',body);
    return response.data;
}
export const updateShoppingListItems= async(body:ShoppingListItems):Promise<ShoppingListItemsResponse>=>{
    const response=await api.post<ShoppingListItemsResponse>(`v0.1/user/add_update_shopping_list_item/${body.id}`,body);
    return response.data;
}
export const getShoppingList= async():Promise<ShoppingListResponse>=>{
    const response=await api.get<ShoppingListResponse>('v0.1/user/shopping_lists');
    return response.data;
}
export const addShoppingList= async(body:ShoppingList):Promise<ShoppingListResponse>=>{
    const response=await api.post<ShoppingListResponse>('v0.1/user/add_update_shopping_list/add',body);
    return response.data;
}
export const deleteShoppingListItems= async(id:number):Promise<ShoppingListResponse>=>{
    const response=await api.post<ShoppingListResponse>(`v0.1/user/delete_shopping_list_item/${id}`);
    return response.data;
}

export interface GeneratedShoppingListItem {
    name: string;
    quantity: string;
    unit: string;
}

export interface GenerateShoppingListResponse {
    status: string;
    payload: {
        shopping_list: GeneratedShoppingListItem[];
    };
}

export const generateShoppingList = async (): Promise<GenerateShoppingListResponse> => {
    const response = await api.post<GenerateShoppingListResponse>('v0.1/user/generate_shopping_list');
    return response.data;
};