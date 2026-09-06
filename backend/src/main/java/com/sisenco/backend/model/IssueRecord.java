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
public class IssueRecord {
    private String description;
    private boolean isKeyIssue; // Indicates if this issue is a key issue
}
