package com.willyam.task_manager_api.repository;

import com.willyam.task_manager_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // Método mágico do Spring Data: Ele vai criar o SQL "SELECT * FROM users WHERE email = ?" sozinho.
    Optional<User> findByEmail(String email);
}
