package com.sisenco.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * @author Dusan
 * @date 9/6/2026
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedData<T> {
    private List<T> content;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
