package com.willyam.task_manager_api.controller;

import com.willyam.task_manager_api.dto.TaskRequestDTO;
import com.willyam.task_manager_api.dto.TaskResponseDTO;
import com.willyam.task_manager_api.dto.TaskStatusUpdateDTO;
import com.willyam.task_manager_api.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> create(@Valid @RequestBody TaskRequestDTO dto) {
        TaskResponseDTO response = taskService.createTask(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> listMyTasks() {
        List<TaskResponseDTO> response = taskService.getTasksByUser();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateStatus(@PathVariable UUID id, @Valid @RequestBody TaskStatusUpdateDTO dto) {
        TaskResponseDTO response = taskService.updateTaskStatus(id, dto.status());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody TaskRequestDTO dto) {
        TaskResponseDTO response = taskService.updateTask(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}