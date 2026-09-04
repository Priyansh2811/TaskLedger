package com.ledger.todo.config;

import com.ledger.todo.model.Task;
import com.ledger.todo.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TaskRepository repository;

    public DataSeeder(TaskRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        LocalDate today = LocalDate.now();

        seed("Draft the ledger schema", "Outline entities before wiring the API.", Task.Priority.HIGH, "Build", today, 2, Task.Recurrence.NONE, 0);
        seed("Reply to design feedback", null, Task.Priority.MEDIUM, "Correspondence", today, 1, Task.Recurrence.NONE, 1);
        seed("Water the office plants", null, Task.Priority.LOW, "Upkeep", today, 1, Task.Recurrence.WEEKDAYS, 2);
        seed("Review pull request #142", "Focus on the reorder endpoint.", Task.Priority.URGENT, "Build", today, 2, Task.Recurrence.NONE, 3);
        seed("Pay studio rent", null, Task.Priority.HIGH, "Admin", today.plusDays(2), 1, Task.Recurrence.NONE, 4);
        seed("Weekly planning session", "Set the week's three priorities.", Task.Priority.MEDIUM, "Admin", today.plusDays(1), 3, Task.Recurrence.WEEKLY, 5);
        seed("Archive old client files", null, Task.Priority.LOW, "Upkeep", today.minusDays(1), 1, Task.Recurrence.NONE, 6);
    }

    private void seed(String title, String notes, Task.Priority priority, String project,
                       LocalDate due, int effort, Task.Recurrence recurrence, int position) {
        Task t = new Task();
        t.setTitle(title);
        t.setNotes(notes);
        t.setPriority(priority);
        t.setProject(project);
        t.setDueDate(due);
        t.setEffortUnits(effort);
        t.setRecurrence(recurrence);
        t.setPosition(position);
        repository.save(t);
    }
}
