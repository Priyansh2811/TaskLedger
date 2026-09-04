package com.ledger.todo.service;

import com.ledger.todo.model.Task;
import com.ledger.todo.model.TaskRequest;
import com.ledger.todo.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> findAll() {
        return repository.findByArchivedFalseOrderByPositionAsc();
    }

    public Task create(TaskRequest req) {
        Task task = new Task();
        applyRequest(task, req);
        Long maxPos = repository.findByArchivedFalseOrderByPositionAsc()
                .stream().map(Task::getPosition).filter(p -> p != null).map(Integer::longValue)
                .max(Long::compareTo).orElse(-1L);
        task.setPosition((int) (maxPos + 1));
        return repository.save(task);
    }

    public Task update(Long id, TaskRequest req) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + id));
        applyRequest(task, req);
        return repository.save(task);
    }

    private void applyRequest(Task task, TaskRequest req) {
        task.setTitle(req.getTitle());
        task.setNotes(req.getNotes());
        if (req.getPriority() != null) task.setPriority(req.getPriority());
        if (req.getProject() != null && !req.getProject().isBlank()) task.setProject(req.getProject());
        task.setDueDate(req.getDueDate());
        if (req.getEffortUnits() != null) task.setEffortUnits(req.getEffortUnits());
        if (req.getRecurrence() != null) task.setRecurrence(req.getRecurrence());
        if (req.getPosition() != null) task.setPosition(req.getPosition());
    }

    /**
     * Toggle completion. If the task recurs, spawn the next occurrence
     * automatically instead of leaving the list empty tomorrow.
     */
    public Task toggleComplete(Long id) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + id));

        boolean nowCompleted = !task.isCompleted();
        task.setCompleted(nowCompleted);
        task.setCompletedAt(nowCompleted ? Instant.now() : null);
        Task saved = repository.save(task);

        if (nowCompleted && task.getRecurrence() != Task.Recurrence.NONE) {
            spawnNextOccurrence(task);
        }
        return saved;
    }

    private void spawnNextOccurrence(Task completed) {
        Task next = new Task();
        next.setTitle(completed.getTitle());
        next.setNotes(completed.getNotes());
        next.setPriority(completed.getPriority());
        next.setProject(completed.getProject());
        next.setEffortUnits(completed.getEffortUnits());
        next.setRecurrence(completed.getRecurrence());
        next.setDueDate(nextDueDate(completed));
        Long maxPos = repository.findByArchivedFalseOrderByPositionAsc()
                .stream().map(Task::getPosition).filter(p -> p != null).map(Integer::longValue)
                .max(Long::compareTo).orElse(-1L);
        next.setPosition((int) (maxPos + 1));
        repository.save(next);
    }

    private LocalDate nextDueDate(Task task) {
        LocalDate base = task.getDueDate() != null ? task.getDueDate() : LocalDate.now();
        return switch (task.getRecurrence()) {
            case DAILY -> base.plusDays(1);
            case WEEKLY -> base.plusWeeks(1);
            case WEEKDAYS -> {
                LocalDate d = base.plusDays(1);
                while (d.getDayOfWeek() == DayOfWeek.SATURDAY || d.getDayOfWeek() == DayOfWeek.SUNDAY) {
                    d = d.plusDays(1);
                }
                yield d;
            }
            default -> base;
        };
    }

    public void archive(Long id) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + id));
        task.setArchived(true);
        repository.save(task);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void reorder(List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            final int pos = i;
            repository.findById(id).ifPresent(t -> {
                t.setPosition(pos);
                repository.save(t);
            });
        }
    }

    /** Ledger-specific feature: computed summary stats for the header strip. */
    public Map<String, Object> stats() {
        List<Task> all = repository.findByArchivedFalseOrderByPositionAsc();
        long total = all.size();
        long completed = all.stream().filter(Task::isCompleted).count();
        long pending = total - completed;
        LocalDate today = LocalDate.now();
        long dueToday = all.stream()
                .filter(t -> !t.isCompleted() && t.getDueDate() != null && t.getDueDate().isEqual(today))
                .count();
        long overdue = all.stream()
                .filter(t -> !t.isCompleted() && t.getDueDate() != null && t.getDueDate().isBefore(today))
                .count();
        int focusUnitsToday = all.stream()
                .filter(t -> !t.isCompleted() && t.getDueDate() != null && t.getDueDate().isEqual(today))
                .mapToInt(t -> t.getEffortUnits() != null ? t.getEffortUnits() : 1)
                .sum();

        Map<String, Long> byProject = all.stream()
                .filter(t -> !t.isCompleted())
                .collect(Collectors.groupingBy(Task::getProject, Collectors.counting()));

        return Map.of(
                "total", total,
                "completed", completed,
                "pending", pending,
                "dueToday", dueToday,
                "overdue", overdue,
                "focusUnitsToday", focusUnitsToday,
                "byProject", byProject
        );
    }
}
