package com.sisenco.backend.controller;

import com.sisenco.backend.dto.ApiResponse;
import com.sisenco.backend.dto.PaginatedData;
import com.sisenco.backend.dto.ReportRequestDto;
import com.sisenco.backend.model.Report;
import com.sisenco.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @PreAuthorize("hasRole('TEAM_MEMBER')")
    public ResponseEntity<ApiResponse<Report>> createReport(@RequestBody ReportRequestDto dto, Principal principal) {
        Report report = reportService.saveReport(principal.getName(), dto);
        return new ResponseEntity<>(new ApiResponse<>(201, "SUCCESS", report), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEAM_MEMBER')")
    public ResponseEntity<ApiResponse<Report>> updateReport(@PathVariable String id, @RequestBody ReportRequestDto dto, Principal principal) {
        Report report = reportService.updateReport(id, principal.getName(), dto);
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", report));
    }

    @GetMapping("/my-reports")
    @PreAuthorize("hasRole('TEAM_MEMBER')")
    public ResponseEntity<ApiResponse<PaginatedData<Report>>> getMyReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {

        PaginatedData<Report> reports = reportService.getMyReports(principal.getName(), page, size);
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", reports));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'TEAM_MEMBER')")
    public ResponseEntity<ApiResponse<Report>> getReportById(@PathVariable String id) {
        Report report = reportService.getReportById(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", report));
    }
}
