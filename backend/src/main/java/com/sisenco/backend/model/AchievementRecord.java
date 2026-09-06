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
public class AchievementRecord {
    private String description;
    private boolean isKeyAchievement; // Indicates if this achievement is a key achievement
}
