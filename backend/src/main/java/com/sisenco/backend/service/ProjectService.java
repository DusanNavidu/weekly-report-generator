package com.sisenco.backend.service;

import com.sisenco.backend.model.Project;
import java.util.List;

/**
 * @author Dusan
 * @date 9/6/2026
 */

public interface ProjectService {
    Project createProject(Project project);
    List<Project> getAllProjects();
    Project updateProject(String id, Project projectDetails);
    void deleteProject(String id);
}
