import api from './axios';
export interface LoginResponse {
  status: string;
  payload: {
    id: number;
    user_type_id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    token: string;
  };
}

export interface RegisterResponse {
  status: string;
  payload: {
    id: number;
    user_type_id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    token: string;
  };
}

export const loginAPI = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', {
    email,
    password,
  });
  return response.data;
};
export const registerAPI = async (email: string, password: string, name: string ,user_type_id:number): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/register', {
    email,
    password,
    name,
    user_type_id,
  });
  return response.data;
};

