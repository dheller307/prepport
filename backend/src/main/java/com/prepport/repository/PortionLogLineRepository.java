package com.prepport.repository;

import com.prepport.entity.PortionLogLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PortionLogLineRepository extends JpaRepository<PortionLogLine, Long> {
  @Query(
      """
        select coalesce(sum(line.cookedGrams), 0)
        from PortionLogLine line
        where line.batch.id = :batchId
            and line.portionLog.id <> :portionLogId
    """)
  double sumCookedGramsByBatchIdExcludingPortionLogId(
      @Param("batchId") Long batchId, @Param("portionLogId") Long portionLogId);

  @Query(
      """
        select coalesce(sum(line.cookedGrams), 0)
        from PortionLogLine line
        where line.batch.id = :batchId
    """)
  double sumCookedGramsByBatchId(@Param("batchId") Long batchId);

  boolean existsByBatch_Id(Long batchId);
}
