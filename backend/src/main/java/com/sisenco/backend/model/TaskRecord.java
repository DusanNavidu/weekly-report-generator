package com.sisenco.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRecord {
    private String taskName;
    private String priority; // High, Medium, Low
    private String plannedVsActualPercentage; // e.g., "100% / 80%"
    private TaskStatus taskStatus;
    private String plannedVsSpentTime; // e.g., "10h / 12h"
    private String output; // Deliverable
}
