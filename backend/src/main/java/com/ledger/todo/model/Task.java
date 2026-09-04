package com.ledger.todo.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private String project = "General";

    private LocalDate dueDate;

    private boolean completed = false;

    private boolean archived = false;

    // Ledger-specific feature: effort estimate in "focus units" (25-min blocks)
    private Integer effortUnits = 1;

    // Ledger-specific feature: recurrence rule (NONE, DAILY, WEEKLY, WEEKDAYS)
    @Enumerated(EnumType.STRING)
    private Recurrence recurrence = Recurrence.NONE;

    // Streak / order position within its day column for drag-reordering
    private Integer position = 0;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    private Instant completedAt;

    public enum Priority { LOW, MEDIUM, HIGH, URGENT }
    public enum Recurrence { NONE, DAILY, WEEKDAYS, WEEKLY }

    public Task() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public boolean isArchived() { return archived; }
    public void setArchived(boolean archived) { this.archived = archived; }

    public Integer getEffortUnits() { return effortUnits; }
    public void setEffortUnits(Integer effortUnits) { this.effortUnits = effortUnits; }

    public Recurrence getRecurrence() { return recurrence; }
    public void setRecurrence(Recurrence recurrence) { this.recurrence = recurrence; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
