package com.willyam.task_manager_api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ApiErrorDTO(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        List<String> details
) {}