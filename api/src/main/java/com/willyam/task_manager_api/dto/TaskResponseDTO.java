package com.willyam.task_manager_api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskResponseDTO(
        UUID id,
        String title,
        String description,
        String status,
        String priority,
        LocalDateTime dueDate,
        LocalDateTime completedAt,
        CategoryResponseDTO category
) {}