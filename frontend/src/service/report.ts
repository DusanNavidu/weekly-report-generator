import api from "./api";
import { PaginatedResponse } from "./manager";

export interface TaskRecord {
  taskName: string;
  priority: string;
  plannedVsActualPercentage: string;
  taskStatus: string;
  plannedVsSpentTime: string;
  output: string;
}

export interface IssueRecord {
  description: string;
  isKeyIssue: boolean;
}

export interface AchievementRecord {
  description: string;
  isKeyAchievement: boolean;
}

export interface ReportRequestDto {
  projectId: string;
  weekStartDate: string;
  weekEndDate: string;
  tasksCompleted: TaskRecord[];
  tasksPlannedForNextWeek: string[];
  blockers: IssueRecord[];
  achievements: AchievementRecord[];
  notes: string;
  isSubmit: boolean; 
}

export interface Report extends Omit<ReportRequestDto, 'isSubmit'> {
  id: string;
  userId: string;
  status: string;
  currentVersion: number;
  latestManagerComment?: string;
  createdAt: string;
  updatedAt: string;
}

export const createReportAPI = async (data: ReportRequestDto) => {
  const response = await api.post('/reports', data);
  return response.data.data as Report;
};

export const updateReportAPI = async (id: string, data: ReportRequestDto) => {
  const response = await api.put(`/reports/${id}`, data);
  return response.data.data as Report;
};

export const getMyReportsAPI = async (page: number = 0, size: number = 10) => {
  const response = await api.get(`/reports/my-reports?page=${page}&size=${size}`);
  return response.data.data as PaginatedResponse<Report>;
};

export const getReportByIdAPI = async (id: string) => {
  const response = await api.get(`/reports/${id}`);
  return response.data.data as Report;
};