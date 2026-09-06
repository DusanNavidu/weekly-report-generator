import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  Report, 
  ReportRequestDto, 
  createReportAPI, 
  updateReportAPI, 
  getMyReportsAPI 
} from '../../service/report';
import { PaginatedResponse } from '../../service/manager';

interface ReportState {
  myReports: PaginatedResponse<Report> | null;
  currentReport: Report | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  myReports: null,
  currentReport: null,
  loading: false,
  error: null,
};

export const fetchMyReports = createAsyncThunk('reports/fetchMyReports', async ({ page, size }: { page: number; size: number }) => {
  return await getMyReportsAPI(page, size);
});

export const submitNewReport = createAsyncThunk('reports/submitNewReport', async (data: ReportRequestDto) => {
  return await createReportAPI(data);
});

export const editReport = createAsyncThunk('reports/editReport', async ({ id, data }: { id: string; data: ReportRequestDto }) => {
  return await updateReportAPI(id, data);
});

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
      // Fetch My Reports
      .addCase(fetchMyReports.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyReports.fulfilled, (state, action) => { state.loading = false; state.myReports = action.payload; })
      .addCase(fetchMyReports.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch reports'; })
      
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