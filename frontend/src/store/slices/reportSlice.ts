import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  Report, 
  ReportRequestDto, 
  ReviewRequestDto,
  createReportAPI, 
  updateReportAPI, 
  getMyReportsAPI,
  deleteReportAPI,
  reviewReportAPI,
  getAllReportsForManagerAPI
} from '../../service/report';
import { PaginatedResponse } from '../../service/manager';

interface ReportState {
  myReports: PaginatedResponse<Report> | null;
  allReports: PaginatedResponse<Report> | null; 
  currentReport: Report | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  myReports: null,
  allReports: null,
  currentReport: null,
  loading: false,
  error: null,
};

// ==============================
// TEAM MEMBER THUNKS
// ==============================

export const fetchMyReports = createAsyncThunk('reports/fetchMyReports', async ({ page, size }: { page: number; size: number }) => {
  return await getMyReportsAPI(page, size);
});

export const submitNewReport = createAsyncThunk('reports/submitNewReport', async (data: ReportRequestDto) => {
  return await createReportAPI(data);
});

export const editReport = createAsyncThunk('reports/editReport', async ({ id, data }: { id: string; data: ReportRequestDto }) => {
  return await updateReportAPI(id, data);
});

export const deleteReport = createAsyncThunk('reports/deleteReport', async (id: string) => {
  await deleteReportAPI(id);
  return id;
});

// ==============================
// MANAGER THUNKS
// ==============================

export const fetchAllReports = createAsyncThunk('reports/fetchAll', async (params: { page: number; size: number }) => {
  return await getAllReportsForManagerAPI(params.page, params.size);
});

export const submitReportReview = createAsyncThunk('reports/review', async ({ id, data }: { id: string; data: ReviewRequestDto }) => {
  return await reviewReportAPI(id, data);
});

// ==============================
// SLICE & REDUCERS
// ==============================

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Reports (Member)
      .addCase(fetchMyReports.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchMyReports.fulfilled, (state, action) => { 
        state.loading = false; 
        state.myReports = action.payload; 
      })
      .addCase(fetchMyReports.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.error.message || 'Failed to fetch reports'; 
      })
      
      // Fetch All Reports (Manager)
      .addCase(fetchAllReports.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => { 
        state.loading = false; 
        state.allReports = action.payload; 
      })
      .addCase(fetchAllReports.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.error.message || 'Failed to fetch all reports'; 
      })

      // Submit Report
      .addCase(submitNewReport.fulfilled, (state, action) => {
        state.currentReport = action.payload;
      })
      
      // Edit Report
      .addCase(editReport.fulfilled, (state, action) => {
        state.currentReport = action.payload;
      });
  },
});

export const { clearCurrentReport } = reportSlice.actions;
export default reportSlice.reducer;