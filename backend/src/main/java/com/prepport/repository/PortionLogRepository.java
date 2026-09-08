package com.prepport.repository;

import com.prepport.entity.PortionLog;
import com.prepport.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortionLogRepository extends JpaRepository<PortionLog, Long> {
  List<PortionLog> findByUserOrderByPortionDateDesc(User user);

  Optional<PortionLog> findByIdAndUser(Long id, User user);
}
