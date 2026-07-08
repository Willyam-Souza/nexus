package com.willyam.task_manager_api.controller;

import com.willyam.task_manager_api.entity.User;
import com.willyam.task_manager_api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<com.willyam.task_manager_api.dto.UserResponseDTO> register(@jakarta.validation.Valid @RequestBody com.willyam.task_manager_api.dto.UserRequestDTO dto) {
        com.willyam.task_manager_api.dto.UserResponseDTO response = userService.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
