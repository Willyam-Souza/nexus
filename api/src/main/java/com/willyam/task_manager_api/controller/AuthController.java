package com.willyam.task_manager_api.controller;

import com.willyam.task_manager_api.dto.AuthRequestDTO;
import com.willyam.task_manager_api.dto.AuthResponseDTO;
import com.willyam.task_manager_api.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticateUser(@Valid @RequestBody AuthRequestDTO loginRequest) {

        // 1. O Spring Security tenta autenticar usando as credenciais fornecidas
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
        );

        // 2. Se a senha estiver correta, define o usuário como autenticado no contexto
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Gera o token JWT para o usuário
        String jwt = jwtUtils.generateToken(loginRequest.email());

        // 4. Retorna o token para o frontend
        return ResponseEntity.ok(new AuthResponseDTO(jwt));
    }
}