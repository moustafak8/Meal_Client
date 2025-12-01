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
export const householdAPI = async (name:string , invite_code:string): Promise<household> => {
    const response = await api.post<household>('/add_update_household/add',{
        name,
        invite_code
    });
    return response.data;
};
export const membersAPI = async (household_id:number , user_id:number): Promise<members> => {
    const response = await api.post<members>('/add_update_members/add',{
        household_id,
        user_id
    });
    return response.data;
};

    