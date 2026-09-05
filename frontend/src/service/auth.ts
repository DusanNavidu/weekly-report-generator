import api from "./api";

export const loginService = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const refreshTokens = async (refreshToken: string) => {
  const response = await api.post(`/auth/refresh-token`, { refreshToken });
  return response.data.data;
};

export const getMyDetails = async () => {
  const response = await api.get('/users/me');
  return response.data;
};