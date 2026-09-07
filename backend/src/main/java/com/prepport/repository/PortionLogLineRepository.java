package com.prepport.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.prepport.entity.PortionLogLine;

public interface PortionLogLineRepository extends JpaRepository<PortionLogLine, Long> {
    @Query("""
        select coalesce(sum(line.cookedGrams), 0)
        from PortionLogLine line
        where line.batch.id = :batchId
    """)
    double sumCookedGramsByBatchId(@Param("batchId") Long batchId);
}