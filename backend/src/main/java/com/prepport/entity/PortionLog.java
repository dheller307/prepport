package com.prepport.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "portion_logs")
public class PortionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "portion_date", nullable = false)
    private LocalDate portionDate;

    @OneToMany(mappedBy = "portionLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PortionLogLine> lines = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected PortionLog() {
    }

    public PortionLog(String name, LocalDate portionDate) {
        this.name = name;
        this.portionDate = portionDate;
    }

    @PrePersist
    void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public void addLine(PortionLogLine line) {
        lines.add(line);
        line.setPortionLog(this);
    }

    public void replaceLines(List<PortionLogLine> lines) {
        this.lines.clear();

        for (PortionLogLine line : lines) {
            addLine(line);
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDate getPortionDate() {
        return portionDate;
    }

    public List<PortionLogLine> getLines() {
        return lines;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @JsonIgnore
    public User getUser() {
        return user;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void setPortionDate(LocalDate portionDate) {
        this.portionDate = portionDate;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
