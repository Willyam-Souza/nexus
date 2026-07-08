package com.willyam.task_manager_api.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Lista de origens separadas por vírgula — em dev fica solto para qualquer porta local;
    // em produção (Render) definimos isto via variável de ambiente APP_CORS_ORIGINS
    // apontando só para o domínio real do frontend no Vercel.
    // (Nome sem hífen de propósito: o binding relaxado do Spring remove hífens ao mapear
    // para variável de ambiente, então "allowed-origins" viraria ALLOWEDORIGINS, não
    // ALLOWED_ORIGINS — já caímos nessa pegadinha uma vez.)
    @Value("${app.cors.origins:http://localhost:*}")
    private String allowedOrigins;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // Define o BCrypt como o motor de criptografia de senhas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // A Cadeia de Filtros e Regras de Roteamento
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 1. ATIVAMOS O CORS AQUI
                .csrf(csrf -> csrf.disable()) // 2. Desativa proteção CSRF (usamos JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Rotas Abertas
                        .requestMatchers("/api/v1/users/register").permitAll()
                        .requestMatchers("/api/v1/auth/login").permitAll()
                        // Rotas Fechadas
                        .anyRequest().authenticated()
                );

        // Adiciona o nosso segurança (JwtAuthenticationFilter) antes do segurança padrão do Spring
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 3. CONFIGURAÇÃO DO CORS: Definimos quem pode aceder à nossa API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split(",")));

        // Permite os métodos HTTP que vamos utilizar
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Permite que o frontend envie o token de Autorização e o tipo de conteúdo (JSON)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica as regras a todas as rotas da API
        return source;
    }
}