package com.prepport.repository;

import com.prepport.entity.Batch;
import com.prepport.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {
  Optional<Batch> findByIdAndPrepSession_IdAndPrepSession_User(
      Long batchId, Long prepSessionId, User user);

  Optional<Batch> findByIdAndPrepSession_User(Long batchId, User user);
}
