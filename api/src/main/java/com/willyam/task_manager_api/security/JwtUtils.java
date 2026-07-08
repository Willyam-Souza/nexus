package com.willyam.task_manager_api.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    // Chave secreta assinante — vem de application.properties/variável de ambiente,
    // nunca deve ficar hardcoded aqui (o ficheiro .java vai para o Git, o .properties não).
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    // Tempo de expiração do token: 1 dia (em milissegundos)
    private final long jwtExpirationMs = 86400000;

    // Converte a String secreta em uma chave criptográfica segura
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Gerador de Crachá: Pega o e-mail do usuário e assina o token
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    // Leitor de Crachá: Extrai o e-mail que está escondido dentro do token
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Validador de Integridade: Verifica se o token é autêntico e se não expirou
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            // Captura tokens expirados, assinaturas falsas ou strings corrompidas
            return false;
        }
    }
}