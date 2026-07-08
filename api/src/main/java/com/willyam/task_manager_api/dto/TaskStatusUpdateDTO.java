package com.willyam.task_manager_api.dto;

import jakarta.validation.constraints.NotBlank;

public record TaskStatusUpdateDTO(
        @NotBlank(message = "O status é obrigatório")
        String status
) {}
