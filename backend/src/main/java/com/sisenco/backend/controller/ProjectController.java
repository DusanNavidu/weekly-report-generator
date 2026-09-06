package com.sisenco.backend.controller;

import com.sisenco.backend.dto.ApiResponse;
import com.sisenco.backend.dto.ProjectRequestDto;
import com.sisenco.backend.model.Project;
import com.sisenco.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody ProjectRequestDto dto) {
        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());

        Project savedProject = projectService.createProject(project);
        return new ResponseEntity<>(new ApiResponse<>(201, "SUCCESS", savedProject), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'TEAM_MEMBER')")
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", projects));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable String id, @RequestBody ProjectRequestDto dto) {
        Project projectDetails = new Project();
        projectDetails.setName(dto.getName());
        projectDetails.setDescription(dto.getDescription());

        Project updatedProject = projectService.updateProject(id, projectDetails);
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", updatedProject));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<String>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", "Project deleted successfully"));
    }
}
