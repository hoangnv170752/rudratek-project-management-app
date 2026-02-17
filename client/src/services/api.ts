import axios from 'axios';
import { Project, ProjectStatus } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:3001';

console.log('[API] Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface GetProjectsParams {
  page?: number;
  limit?: number;
  status?: ProjectStatus | 'all';
  search?: string;
}

export const projectService = {
  getAll: async (params: GetProjectsParams = {}): Promise<PaginatedResponse<Project>> => {
    const { page = 1, limit = 10, status, search } = params;
    console.log('[API] Fetching projects, page:', page, 'limit:', limit);
    try {
      const response = await apiClient.get<PaginatedResponse<Project>>('/projects', {
        params: { page, limit, status, search },
      });
      console.log('[API] Success, got', response.data.data.length, 'projects, total:', response.data.pagination.total);
      return response.data;
    } catch (error: any) {
      console.log('[API] Error:', error.message);
      throw error;
    }
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: ProjectStatus): Promise<Project> => {
    const response = await apiClient.patch<Project>(`/projects/${id}`, { status });
    return response.data;
  },
};

export const setApiBaseUrl = (url: string) => {
  apiClient.defaults.baseURL = url;
};
