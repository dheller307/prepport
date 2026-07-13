package com.prepport.repository;

import com.prepport.entity.PrepSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrepSessionRepository extends JpaRepository<PrepSession, Long> {
}