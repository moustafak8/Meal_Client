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
    const response = await api.post<household>('v0.1/user/add_update_household/add',{
        name,
        invite_code
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

    