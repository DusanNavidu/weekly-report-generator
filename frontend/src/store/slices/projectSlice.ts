import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await api.get('/projects');
  return response.data.data;
});

export const createProject = createAsyncThunk('projects/createProject', async (projectData: { name: string; description: string }) => {
  const response = await api.post('/projects', projectData);
  return response.data.data;
});

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, data }: { id: string; data: { name: string; description: string } }) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data.data;
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id: string) => {
  await api.delete(`/projects/${id}`);
  return id;
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })

      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })

      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })

      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload); // Delete වුණු project එක array එකෙන් අයින් කිරීම
      });
  },
});

export default projectSlice.reducer;