package com.prepport.repository;

import com.prepport.entity.PortionLog;
import com.prepport.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PortionLogRepository extends JpaRepository<PortionLog, Long> {
  List<PortionLog> findByUserOrderByPortionDateDesc(User user);

  Optional<PortionLog> findByIdAndUser(Long id, User user);

  @Query(
      """
      select distinct line.portionLog
      from PortionLogLine line
      where line.batch.prepSession.id = :sessionId
      """)
  List<PortionLog> findDistinctByBatchPrepSessionId(@Param("sessionId") Long sessionId);
}
