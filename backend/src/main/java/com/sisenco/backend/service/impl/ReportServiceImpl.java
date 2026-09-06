package com.sisenco.backend.service.impl;

import com.sisenco.backend.dto.PaginatedData;
import com.sisenco.backend.dto.ReportRequestDto;
import com.sisenco.backend.dto.ReviewRequestDto;
import com.sisenco.backend.model.Report;
import com.sisenco.backend.model.ReportStatus;
import com.sisenco.backend.model.User;
import com.sisenco.backend.repository.ReportRepository;
import com.sisenco.backend.repository.UserRepository;
import com.sisenco.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public Report saveReport(String userEmail, ReportRequestDto dto) {
        User user = getUserByEmail(userEmail);

        Report report = new Report();
        report.setUserId(user.getId());
        report.setProjectId(dto.getProjectId());
        report.setWeekStartDate(dto.getWeekStartDate());
        report.setWeekEndDate(dto.getWeekEndDate());
        report.setTasksCompleted(dto.getTasksCompleted());
        report.setTasksPlannedForNextWeek(dto.getTasksPlannedForNextWeek());
        report.setBlockers(dto.getBlockers());
        report.setAchievements(dto.getAchievements());
        report.setNotes(dto.getNotes());

        report.setStatus(dto.isSubmit() ? ReportStatus.SUBMITTED : ReportStatus.DRAFT);

        return reportRepository.save(report);
    }

    @Override
    public Report updateReport(String reportId, String userEmail, ReportRequestDto dto) {
        User user = getUserByEmail(userEmail);
        Report existingReport = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (!existingReport.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to edit this report");
        }

        if (existingReport.getStatus() == ReportStatus.SUBMITTED || existingReport.getStatus() == ReportStatus.APPROVED) {
            throw new RuntimeException("Cannot edit report. This report is currently " + existingReport.getStatus());
        }

        existingReport.setProjectId(dto.getProjectId());
        existingReport.setWeekStartDate(dto.getWeekStartDate());
        existingReport.setWeekEndDate(dto.getWeekEndDate());
        existingReport.setTasksCompleted(dto.getTasksCompleted());
        existingReport.setTasksPlannedForNextWeek(dto.getTasksPlannedForNextWeek());
        existingReport.setBlockers(dto.getBlockers());
        existingReport.setAchievements(dto.getAchievements());
        existingReport.setNotes(dto.getNotes());
        existingReport.setUpdatedAt(new Date());

        if (dto.isSubmit()) {
            existingReport.setStatus(ReportStatus.SUBMITTED);
        }

        return reportRepository.save(existingReport);
    }

    @Override
    public PaginatedData<Report> getMyReports(String userEmail, int page, int size) {
        User user = getUserByEmail(userEmail);

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findByUserId(user.getId(), pageRequest);

        return new PaginatedData<>(
                reportPage.getContent(),
                reportPage.getNumber(),
                reportPage.getTotalPages(),
                reportPage.getTotalElements()
        );
    }

    @Override
    public void deleteReport(String reportId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Report existingReport = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // 1. Authorization Validation
        if (!existingReport.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this report");
        }

        // 2. Status Validation
        if (existingReport.getStatus() != ReportStatus.DRAFT) {
            throw new RuntimeException("Only reports in DRAFT status can be deleted.");
        }

        reportRepository.delete(existingReport);
    }

    @Override
    public Report getReportById(String id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    @Override
    public PaginatedData<Report> getAllReportsForManager(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        Page<Report> reportPage = reportRepository.findAll(pageRequest);

        return new PaginatedData<>(
                reportPage.getContent(),
                reportPage.getNumber(),
                reportPage.getTotalPages(),
                reportPage.getTotalElements()
        );
    }

    @Override
    public Report reviewReport(String reportId, ReviewRequestDto dto) {
        Report existingReport = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (existingReport.getStatus() == ReportStatus.DRAFT) {
            throw new RuntimeException("Cannot review a report that is still in DRAFT status.");
        }

        existingReport.setStatus(dto.getStatus());
        existingReport.setLatestManagerComment(dto.getComment());

        if (dto.getStatus() == ReportStatus.NEEDS_CORRECTION) {
            existingReport.setCurrentVersion(existingReport.getCurrentVersion() + 1);
        }

        existingReport.setUpdatedAt(new Date());

        return reportRepository.save(existingReport);
    }
}
