package com.willyam.task_manager_api.dto;

import java.util.UUID;

public record CategoryResponseDTO(
        UUID id,
        String name,
        String color
) {}