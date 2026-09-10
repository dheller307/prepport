package com.prepport.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prep_sessions")
public class PrepSession {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @OneToMany(
      mappedBy = "prepSession",
      fetch = FetchType.EAGER,
      cascade = CascadeType.ALL,
      orphanRemoval = true)
  private List<Batch> batches = new ArrayList<>();

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "session_date", nullable = false)
  private LocalDate sessionDate;

  @Column(name = "notes")
  private String notes;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  protected PrepSession() {}

  public PrepSession(String name, LocalDate sessionDate) {
    this.name = name;
    this.sessionDate = sessionDate;
  }

  @PrePersist
  void onCreate() {
    if (this.createdAt == null) {
      this.createdAt = LocalDateTime.now();
    }
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public LocalDate getSessionDate() {
    return sessionDate;
  }

  public String getNotes() {
    return notes;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  @JsonManagedReference
  public List<Batch> getBatches() {
    return batches;
  }

  @JsonIgnore
  public User getUser() {
    return user;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setSessionDate(LocalDate sessionDate) {
    this.sessionDate = sessionDate;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public void setUser(User user) {
    this.user = user;
  }
}
