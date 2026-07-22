package com.prepport.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prepport.entity.PrepSession;
import com.prepport.entity.User;

public interface PrepSessionRepository extends JpaRepository<PrepSession, Long> {
    List<PrepSession> findByUser(User user);

    Optional<PrepSession> findByIdAndUser(Long id, User user);

    boolean existsByIdAndUser(Long id, User user);

    void deleteByIdAndUser(Long id, User user);
}