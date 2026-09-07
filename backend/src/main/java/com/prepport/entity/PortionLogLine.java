package com.prepport.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "portion_log_lines")
public class PortionLogLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "portion_log", nullable = false)
    private PortionLog portionLog;

    @ManyToOne
    @JoinColumn(name = "batch", nullable = false)
    private Batch batch;

    @Column(name = "cooked_grams", nullable = false)
    private double cookedGrams;

    protected PortionLogLine() {
    }

    public PortionLogLine(PortionLog portionLog, Batch batch, double cookedGrams) {
        this.portionLog = portionLog;
        this.batch = batch;
        this.cookedGrams = cookedGrams;
    }

    public Long getId() {
        return id;
    }

    public PortionLog getPortionLog() {
        return portionLog;
    }

    public Batch getBatch() {
        return batch;
    }

    public double getCookedGrams() {
        return cookedGrams;
    }

    public void setPortionLog(PortionLog portionLog) {
        this.portionLog = portionLog;
    }

    public void setBatch(Batch batch) {
        this.batch = batch;
    }

    public void setCookedGrams(double cookedGrams) {
        this.cookedGrams = cookedGrams;
    }
}