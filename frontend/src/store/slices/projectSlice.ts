import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';

interface Project {
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

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      });
  },
});

export default projectSlice.reducer;