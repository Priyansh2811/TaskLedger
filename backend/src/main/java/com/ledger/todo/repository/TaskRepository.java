package com.ledger.todo.repository;

import com.ledger.todo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByArchivedFalseOrderByPositionAsc();
    List<Task> findByProjectAndArchivedFalse(String project);
}
