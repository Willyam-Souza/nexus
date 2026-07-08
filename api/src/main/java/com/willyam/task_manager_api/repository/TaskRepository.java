package com.willyam.task_manager_api.repository;

import com.willyam.task_manager_api.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    // Retorna todas as tarefas de um usuário específico
    List<Task> findByUserId(UUID userId);

    // Retorna tarefas de um usuário filtradas por status (ex: PENDING)
    List<Task> findByUserIdAndStatus(UUID userId, String status);
}
