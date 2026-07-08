package com.willyam.task_manager_api.security;

import com.willyam.task_manager_api.entity.User;
import com.willyam.task_manager_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Procura o usuário no banco de dados pelo e-mail
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilizador não encontrado com o e-mail: " + email));

        // Retorna a nossa implementação customizada que guarda o ID
        return new CustomUserDetails(user.getId(), user.getEmail(), user.getPassword());
    }

    // Classe estática interna para transportar o ID do utilizador no contexto de segurança
    public static class CustomUserDetails implements UserDetails {
        private final UUID id;
        private final String username;
        private final String password;

        public CustomUserDetails(UUID id, String username, String password) {
            this.id = id;
            this.username = username;
            this.password = password;
        }

        // Método extra criado para recuperarmos o ID nos Services
        public UUID getId() { return id; }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() { return Collections.emptyList(); }

        @Override
        public String getPassword() { return password; }

        @Override
        public String getUsername() { return username; }

        @Override
        public boolean isAccountNonExpired() { return true; }

        @Override
        public boolean isAccountNonLocked() { return true; }

        @Override
        public boolean isCredentialsNonExpired() { return true; }

        @Override
        public boolean isEnabled() { return true; }
    }
}