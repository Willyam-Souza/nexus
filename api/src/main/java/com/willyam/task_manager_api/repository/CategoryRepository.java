package com.willyam.task_manager_api.repository;

import com.willyam.task_manager_api.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    // Retorna todas as categorias que pertencem a um usuário específico
    List<Category> findByUserId(UUID userId);
}
