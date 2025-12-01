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
      household_id:number;
      user_id: number;
      created_at: string;
      updated_at: string;
    };
  }
  export interface items {
    status: string;
    payload: {
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
    };
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

    