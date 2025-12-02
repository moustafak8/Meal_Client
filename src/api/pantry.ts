import api from './axios';

// Types for API responses
export interface household {
  status: string;
  payload: {
    id: number;
    name: string;
    invite_code: string;
    created_at: string;
    updated_at: string;
  };
}
export interface members {
    status: string;
    payload: {
      id: number;
      household_id:string;
      user_id: number;
      created_at: string;
      updated_at: string;
    };
  }
  export interface item {
    id: number;
    household_id:number;
    added_by: number;
    unit_id:number;
    name:string;
    quantity:number;
    expiration_date:string;
    location:string;
    created_at: string;
    updated_at: string;
  }

  export interface items {
    status: string;
    payload: item;
  }

  export interface pantryItemsResponse {
    status: string;
    payload: item[];
  }
  export interface unit{
    id: number;
    name:string;
    created_at: string;
    updated_at: string;
  }

  export interface unitsResponse {
    status: string;
    payload: unit[];
  }
export const householdAPI = async (name:string , invite_code:string , userid:string): Promise<household> => {
    const response = await api.post<household>('v0.1/user/add_update_household/add',{
        name,
        invite_code,
        userid
    });
    return response.data;
};
export const membersAPI = async (invitecode:string , userid:string): Promise<members> => {
    const response = await api.post<members>('v0.1/user/add_update_members/add',{
        invitecode,
        userid
    });
    return response.data;
};
export const getUnit = async (): Promise<unitsResponse> => {
  const response = await api.post<unitsResponse>('v0.1/user/unit/');
  return response.data;
};
export const addItem = async (
  household_id: string | number,
  user_id: string | number,
  unit_id: string | number,
  name: string,
  quantity: number,
  expiry_date: string,
  location: string
): Promise<items> => {
  const response = await api.post<items>('v0.1/user/add_update_pantry_item/add', {
    household_id: String(household_id),
    user_id: String(user_id),
    unit_id: String(unit_id),
    name: name.trim(),
    quantity: quantity,
    expiry_date: expiry_date,
    location: location.trim(),
  });
  return response.data;
};

export const gethousehold_id = async (userid: string): Promise<members> => {
  const response = await api.post<members>('v0.1/user/add_update_members/id', {
    userid
  });
  if (response.data.payload?.household_id) {
    localStorage.setItem('household_id', String(response.data.payload.household_id));
  }
  
  return response.data;
};

export const getPantryItems = async (household_id: string | number): Promise<pantryItemsResponse> => {
  const response = await api.get<pantryItemsResponse>(`v0.1/user/pantry_items/${household_id}`);
  return response.data;
};

