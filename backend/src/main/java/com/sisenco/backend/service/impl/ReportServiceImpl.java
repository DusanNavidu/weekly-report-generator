package com.sisenco.backend.service.impl;

import com.sisenco.backend.dto.DashboardStatsDto;
import com.sisenco.backend.dto.PaginatedData;
import com.sisenco.backend.dto.ReportRequestDto;
import com.sisenco.backend.dto.ReviewRequestDto;
import com.sisenco.backend.model.Report;
import com.sisenco.backend.model.ReportStatus;
import com.sisenco.backend.model.User;
import com.sisenco.backend.repository.ProjectRepository;
import com.sisenco.backend.repository.ReportRepository;
import com.sisenco.backend.repository.UserRepository;
import com.sisenco.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

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

        if (existingReport.getPreviousVersions() == null) {
            existingReport.setPreviousVersions(new ArrayList<>());
        }

        Map<String, Object> oldVersion = new HashMap<>();
        oldVersion.put("version", existingReport.getCurrentVersion());
        oldVersion.put("status", existingReport.getStatus());

        // Use new ArrayLists to prevent MongoDB references from updating the history when the current arrays change
        oldVersion.put("tasksCompleted", existingReport.getTasksCompleted() != null ? new ArrayList<>(existingReport.getTasksCompleted()) : new ArrayList<>());
        oldVersion.put("blockers", existingReport.getBlockers() != null ? new ArrayList<>(existingReport.getBlockers()) : new ArrayList<>());
        oldVersion.put("achievements", existingReport.getAchievements() != null ? new ArrayList<>(existingReport.getAchievements()) : new ArrayList<>());

        oldVersion.put("projectId", existingReport.getProjectId());
        oldVersion.put("weekStartDate", existingReport.getWeekStartDate());
        oldVersion.put("weekEndDate", existingReport.getWeekEndDate());
        oldVersion.put("tasksPlannedForNextWeek", existingReport.getTasksPlannedForNextWeek() != null ? new ArrayList<>(existingReport.getTasksPlannedForNextWeek()) : new ArrayList<>());
        oldVersion.put("notes", existingReport.getNotes());

        oldVersion.put("savedAt", new Date());

        existingReport.getPreviousVersions().add(oldVersion);
        existingReport.setCurrentVersion(existingReport.getCurrentVersion() + 1);

        // Update with new data
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

        if (dto.getComment() != null && !dto.getComment().trim().isEmpty()) {
            if (existingReport.getCommentHistory() == null) {
                existingReport.setCommentHistory(new ArrayList<>());
            }
            String historyEntry = new Date().toString() + " - " + dto.getStatus() + ": " + dto.getComment();
            existingReport.getCommentHistory().add(historyEntry);
        }

        if (dto.getStatus() == ReportStatus.NEEDS_CORRECTION) {
            // Note: Since currentVersion is also incremented in updateReport, you may remove this line
            // if you only want the version to bump upon user submission, rather than manager review.
            existingReport.setCurrentVersion(existingReport.getCurrentVersion() + 1);
        }

        existingReport.setUpdatedAt(new Date());

        return reportRepository.save(existingReport);
    }

    @Override
    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalMembers(userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "TEAM_MEMBER".equals(u.getRole().toString()))
                .count());

        stats.setActiveProjects(projectRepository.count());

        long totalReports = reportRepository.count();
        long pendingReviews = reportRepository.countByStatus(ReportStatus.SUBMITTED);

        stats.setReportsThisWeek(totalReports);
        stats.setPendingReviews(pendingReviews);

        Map<String, Long> distribution = new HashMap<>();
        distribution.put("DRAFT", reportRepository.countByStatus(ReportStatus.DRAFT));
        distribution.put("SUBMITTED", pendingReviews);
        distribution.put("NEEDS_CORRECTION", reportRepository.countByStatus(ReportStatus.NEEDS_CORRECTION));
        distribution.put("APPROVED", reportRepository.countByStatus(ReportStatus.APPROVED));

        stats.setReportStatusDistribution(distribution);

        return stats;
    }

    @Override
    public Map<String, Object> getTeamMemberProfile(String userId) {
        List<Report> reports = reportRepository.findByUserIdOrderByCreatedAtDesc(userId);

        long total = reports.size();
        long approved = reports.stream().filter(r -> r.getStatus() == ReportStatus.APPROVED).count();
        long needsCorrection = reports.stream().filter(r -> r.getStatus() == ReportStatus.NEEDS_CORRECTION).count();
        long pendingReview = reports.stream().filter(r -> r.getStatus() == ReportStatus.SUBMITTED).count();

        Map<String, Object> profileData = new HashMap<>();
        profileData.put("totalReports", total);
        profileData.put("approved", approved);
        profileData.put("needsCorrection", needsCorrection);
        profileData.put("pendingReview", pendingReview);
        profileData.put("reports", reports);

        return profileData;
    }
}
