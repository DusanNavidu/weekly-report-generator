package com.sisenco.backend.dto;

import com.sisenco.backend.model.ReportStatus;
import lombok.Data;

/**
 * @author Dusan
 * @date 9/7/2026
 */

@Data
public class ReviewRequestDto {
    private ReportStatus status; // APPROVED or NEEDS_CORRECTION
    private String comment; // Manager's comment
}
