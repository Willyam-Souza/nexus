package com.willyam.task_manager_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

public record TaskRequestDTO(
        @NotBlank(message = "O título da tarefa é obrigatório")
        @Size(max = 200, message = "O título não pode passar de 200 caracteres")
        String title,
        String description,
        String priority,
        LocalDateTime dueDate,
        UUID categoryId
) {}