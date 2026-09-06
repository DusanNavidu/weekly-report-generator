package com.sisenco.backend.service;

import com.sisenco.backend.dto.DashboardStatsDto;
import com.sisenco.backend.dto.PaginatedData;
import com.sisenco.backend.dto.ReportRequestDto;
import com.sisenco.backend.dto.ReviewRequestDto;
import com.sisenco.backend.model.Report;

/**
 * @author Dusan
 * @date 9/6/2026
 */

public interface ReportService {
    Report saveReport(String userEmail, ReportRequestDto dto);
    Report updateReport(String reportId, String userEmail, ReportRequestDto dto);
    void deleteReport(String reportId, String userEmail);
    PaginatedData<Report> getMyReports(String userEmail, int page, int size);
    Report getReportById(String id);
    PaginatedData<Report> getAllReportsForManager(int page, int size);
    Report reviewReport(String reportId, ReviewRequestDto dto);
    DashboardStatsDto getDashboardStats();
}
