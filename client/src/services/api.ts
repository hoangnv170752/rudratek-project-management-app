import axios from 'axios';
import { Project, ProjectStatus } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/projects');
    return response.data;
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
