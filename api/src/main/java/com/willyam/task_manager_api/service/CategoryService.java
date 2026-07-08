package com.willyam.task_manager_api.service;

import com.willyam.task_manager_api.dto.CategoryRequestDTO;
import com.willyam.task_manager_api.dto.CategoryResponseDTO;
import com.willyam.task_manager_api.entity.Category;
import com.willyam.task_manager_api.entity.User;
import com.willyam.task_manager_api.repository.CategoryRepository;
import com.willyam.task_manager_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // Método seguro que extrai o ID do utilizador através do JWT
    private UUID getAuthenticatedUserId() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof com.willyam.task_manager_api.security.CustomUserDetailsService.CustomUserDetails) {
            return ((com.willyam.task_manager_api.security.CustomUserDetailsService.CustomUserDetails) principal).getId();
        }
        throw new IllegalStateException("Utilizador não autenticado no contexto.");
    }

    public CategoryResponseDTO createCategory(CategoryRequestDTO dto) {
        UUID userId = getAuthenticatedUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilizador não encontrado."));

        Category category = new Category();
        category.setName(dto.name());
        category.setColor(dto.color());
        category.setUser(user);

        Category savedCategory = categoryRepository.save(category);

        return new CategoryResponseDTO(
                savedCategory.getId(),
                savedCategory.getName(),
                savedCategory.getColor()
        );
    }

    public List<CategoryResponseDTO> getCategoriesByUser() {
        UUID userId = getAuthenticatedUserId();
        return categoryRepository.findByUserId(userId)
                .stream()
                .map(cat -> new CategoryResponseDTO(cat.getId(), cat.getName(), cat.getColor()))
                .collect(Collectors.toList());
    }
}