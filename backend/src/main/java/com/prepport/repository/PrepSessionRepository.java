package com.prepport.repository;

import com.prepport.entity.PrepSession;
import com.prepport.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrepSessionRepository extends JpaRepository<PrepSession, Long> {
  List<PrepSession> findByUser(User user);

  Optional<PrepSession> findByIdAndUser(Long id, User user);
}
