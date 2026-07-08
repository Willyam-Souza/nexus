package com.willyam.task_manager_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CategoryRequestDTO(
        @NotBlank(message = "O nome da categoria é obrigatório")
        String name,

        @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "A cor deve ser um código hexadecimal válido (Ex: #3B82F6)")
        String color
) {}