package com.prepport.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "batches")
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prep_session_id", nullable = false)
    private PrepSession prepSession;
    
    @ManyToOne
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "raw_weight_g")
    private Double rawWeightG;

    @Column(name = "cooked_weight_g", nullable = false)
    private Double cookedWeightG;

    protected Batch() {
    }

    public Batch(Ingredient ingredient, Double rawWeightG, Double cookedWeightG) {
        this.ingredient = ingredient;
        this.rawWeightG = rawWeightG;
        this.cookedWeightG = cookedWeightG;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Double getRawWeightG() {
        return rawWeightG;
    }

    public Double getCookedWeightG() {
        return cookedWeightG;
    }

    @JsonBackReference
    public PrepSession getPrepSession() {
        return prepSession;
    }

    public Ingredient getIngredient() {
        return ingredient;
    }

    public void setRawWeightG(double rawWeightG) {
        this.rawWeightG = rawWeightG;
    }
    
    public void setCookedWeightG(double cookedWeightG) {
        this.cookedWeightG = cookedWeightG;
    }

    public void setPrepSession(PrepSession prepSession) {
        this.prepSession = prepSession;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }
}