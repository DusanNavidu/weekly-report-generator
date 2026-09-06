package com.sisenco.backend.dto;

import lombok.Data;
import java.util.Map;

/**
 * @author Dusan
 * @date 9/7/2026
 */

@Data
public class DashboardStatsDto {
    private long totalMembers;
    private long activeProjects;
    private long reportsThisWeek;
    private long pendingReviews;
    private Map<String, Long> reportStatusDistribution; // For pie chart: key = status, value = count
}
