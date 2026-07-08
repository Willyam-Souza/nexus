package com.willyam.task_manager_api.service;

import com.willyam.task_manager_api.dto.UserRequestDTO;
import com.willyam.task_manager_api.dto.UserResponseDTO;
import com.willyam.task_manager_api.entity.User;
import com.willyam.task_manager_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Adicionamos o codificador aqui

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO registerUser(UserRequestDTO dto) {

        if (userRepository.findByEmail(dto.email()).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está em uso.");
        }

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());

        // A mágica acontece aqui: pegamos a senha em texto puro e transformamos em um hash irreversível
        user.setPassword(passwordEncoder.encode(dto.password()));

        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }
}