package com.willyam.task_manager_api.dto;

import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String name,
        String email
) {}
