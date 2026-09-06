package com.sisenco.backend.dto;

import com.sisenco.backend.model.AchievementRecord;
import com.sisenco.backend.model.IssueRecord;
import com.sisenco.backend.model.TaskRecord;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Data
public class ReportRequestDto {
    private String projectId;
    private Date weekStartDate;
    private Date weekEndDate;

    private List<TaskRecord> tasksCompleted;
    private List<String> tasksPlannedForNextWeek;
    private List<IssueRecord> blockers;
    private List<AchievementRecord> achievements;

    private String notes;
    private boolean isSubmit; // If true, the report will be submitted for review; if false, it will be saved as a draft.
}
