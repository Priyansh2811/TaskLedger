package com.ledger.todo.model;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class TaskRequest {

    @NotBlank
    private String title;

    private String notes;
    private Task.Priority priority;
    private String project;
    private LocalDate dueDate;
    private Integer effortUnits;
    private Task.Recurrence recurrence;
    private Integer position;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Task.Priority getPriority() { return priority; }
    public void setPriority(Task.Priority priority) { this.priority = priority; }

    public String getProject() { return project; }
    public void setProject(String project) { this.project = project; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Integer getEffortUnits() { return effortUnits; }
    public void setEffortUnits(Integer effortUnits) { this.effortUnits = effortUnits; }

    public Task.Recurrence getRecurrence() { return recurrence; }
    public void setRecurrence(Task.Recurrence recurrence) { this.recurrence = recurrence; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }
}
