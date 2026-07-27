package com.prepport.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prepport.entity.Batch;
import com.prepport.entity.User;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    Optional<Batch> findByIdAndPrepSession_User(Long id, User user);
}