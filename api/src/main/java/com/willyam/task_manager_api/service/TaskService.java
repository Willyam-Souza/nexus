package com.willyam.task_manager_api.service;

import com.willyam.task_manager_api.dto.CategoryResponseDTO;
import com.willyam.task_manager_api.dto.TaskRequestDTO;
import com.willyam.task_manager_api.dto.TaskResponseDTO;
import com.willyam.task_manager_api.entity.Category;
import com.willyam.task_manager_api.entity.Task;
import com.willyam.task_manager_api.entity.User;
import com.willyam.task_manager_api.repository.CategoryRepository;
import com.willyam.task_manager_api.repository.TaskRepository;
import com.willyam.task_manager_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    // Método seguro que extrai o ID do utilizador através do JWT
    private UUID getAuthenticatedUserId() {
        Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof com.willyam.task_manager_api.security.CustomUserDetailsService.CustomUserDetails) {
            return ((com.willyam.task_manager_api.security.CustomUserDetailsService.CustomUserDetails) principal).getId();
        }
        throw new IllegalStateException("Utilizador não autenticado no contexto.");
    }

    public TaskResponseDTO createTask(TaskRequestDTO dto) {
        UUID userId = getAuthenticatedUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilizador não encontrado."));

        Category category = null;
        if (dto.categoryId() != null) {
            category = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
        }

        Task task = new Task();
        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setUser(user);
        task.setCategory(category);

        if (dto.priority() != null) {
            task.setPriority(dto.priority().toUpperCase());
        }
        if (dto.dueDate() != null) {
            task.setDueDate(dto.dueDate());
        }

        Task savedTask = taskRepository.save(task);
        return convertToResponseDTO(savedTask);
    }

    public List<TaskResponseDTO> getTasksByUser() {
        UUID userId = getAuthenticatedUserId();
        return taskRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public TaskResponseDTO updateTaskStatus(UUID taskId, String status) {
        UUID userId = getAuthenticatedUserId();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada."));

        if (!task.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Tarefa não encontrada.");
        }

        task.setStatus(status.toUpperCase());
        task.setCompletedAt("COMPLETED".equalsIgnoreCase(status) ? java.time.LocalDateTime.now() : null);

        Task savedTask = taskRepository.save(task);
        return convertToResponseDTO(savedTask);
    }

    public TaskResponseDTO updateTask(UUID taskId, TaskRequestDTO dto) {
        UUID userId = getAuthenticatedUserId();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada."));

        if (!task.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Tarefa não encontrada.");
        }

        Category category = null;
        if (dto.categoryId() != null) {
            category = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
        }

        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setCategory(category);
        task.setPriority(dto.priority() != null ? dto.priority().toUpperCase() : task.getPriority());
        task.setDueDate(dto.dueDate());

        Task savedTask = taskRepository.save(task);
        return convertToResponseDTO(savedTask);
    }

    public void deleteTask(UUID taskId) {
        UUID userId = getAuthenticatedUserId();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada."));

        if (!task.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Tarefa não encontrada.");
        }

        taskRepository.delete(task);
    }

    private TaskResponseDTO convertToResponseDTO(Task task) {
        CategoryResponseDTO categoryDTO = null;
        if (task.getCategory() != null) {
            categoryDTO = new CategoryResponseDTO(
                    task.getCategory().getId(),
                    task.getCategory().getName(),
                    task.getCategory().getColor()
            );
        }

        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getCompletedAt(),
                categoryDTO
        );
    }
}