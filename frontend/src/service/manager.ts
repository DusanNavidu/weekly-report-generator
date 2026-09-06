import api from "./api";

export interface UserDTO {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export const getTeamMembers = async (page: number = 0, size: number = 10) => {
  const response = await api.get(`/users/members?page=${page}&size=${size}`);
  return response.data.data as PaginatedResponse<UserDTO>;
};

export const addTeamMember = async (userData: UserDTO) => {
  const response = await api.post('/users/add-member', userData);
  return response.data.data;
};