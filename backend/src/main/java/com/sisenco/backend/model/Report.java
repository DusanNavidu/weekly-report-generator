package com.sisenco.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reports")
public class Report {
    @Id
    private String id;

    private String userId; // Team Member ගේ ID එක
    private String projectId; // Project/Category ID එක

    private Date weekStartDate;
    private Date weekEndDate;

    private ReportStatus status = ReportStatus.DRAFT; // Default status

    private List<TaskRecord> tasksCompleted = new ArrayList<>();
    private List<String> tasksPlannedForNextWeek = new ArrayList<>();

    private List<IssueRecord> blockers = new ArrayList<>();
    private List<AchievementRecord> achievements = new ArrayList<>();

    // Optional Fields
    private String notes;

    // Review & Workflow Data
    private int currentVersion = 1;
    private String latestManagerComment;

    private Date createdAt = new Date();
    private Date updatedAt = new Date();
}
