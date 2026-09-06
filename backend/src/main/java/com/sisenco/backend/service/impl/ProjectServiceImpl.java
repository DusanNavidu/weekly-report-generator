package com.sisenco.backend.service.impl;

import com.sisenco.backend.model.Project;
import com.sisenco.backend.repository.ProjectRepository;
import com.sisenco.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    public Project createProject(Project project) {
        if (projectRepository.existsByName(project.getName())) {
            throw new RuntimeException("Project name already exists!");
        }
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findByIsActiveTrue();
    }

    @Override
    public Project updateProject(String id, Project projectDetails) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        existingProject.setName(projectDetails.getName());
        existingProject.setDescription(projectDetails.getDescription());
        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setActive(false);
        projectRepository.save(project);
    }
}