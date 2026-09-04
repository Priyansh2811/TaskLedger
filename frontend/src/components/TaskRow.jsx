import React, { useState } from 'react';

const PRIORITY_MARK = {
  LOW: '·',
  MEDIUM: '•',
  HIGH: '●',
  URGENT: '▲',
};

const RECURRENCE_TAG = {
  NONE: null,
  DAILY: 'daily',
  WEEKDAYS: 'weekdays',
  WEEKLY: 'weekly',
};

function formatDue(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffDays = Math.round((due - today) / 86400000);

  if (diffDays === 0) return { text: 'today', tone: 'today' };
  if (diffDays === 1) return { text: 'tomorrow', tone: 'soon' };
  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, tone: 'overdue' };
  if (diffDays <= 6) return { text: due.toLocaleDateString(undefined, { weekday: 'short' }), tone: 'soon' };
  return { text: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), tone: 'future' };
}

export default function TaskRow({
  task,
  index,
  onToggle,
  onUpdate,
  onArchive,
  onDelete,
  dragHandlers,
  isDragging,
  isDragOver,
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const due = formatDue(task.dueDate);
  const idTag = `T-${String(task.id).padStart(4, '0')}`;
  const recurrenceTag = RECURRENCE_TAG[task.recurrence];

  function saveEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate(task.id, { ...task, title: trimmed });
    } else {
      setDraft(task.title);
    }
    setEditing(false);
  }

  function handleEditKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      setDraft(task.title);
      setEditing(false);
    }
  }

  return (
    <li
      className={`task-row ${task.completed ? 'task-row--done' : ''} ${isDragging ? 'task-row--dragging' : ''} ${isDragOver ? 'task-row--drag-over' : ''}`}
      draggable
      onDragStart={(e) => dragHandlers.onDragStart(e, index)}
      onDragOver={(e) => dragHandlers.onDragOver(e, index)}
      onDrop={(e) => dragHandlers.onDrop(e, index)}
      onDragEnd={dragHandlers.onDragEnd}
    >
      <div className="task-row-main">
        <span className="drag-grip" aria-hidden="true" title="Drag to reorder">⠿</span>

        <button
          className={`task-check ${task.completed ? 'task-check--on' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-pressed={task.completed}
          aria-label={task.completed ? 'Mark not done' : 'Mark done'}
        >
          {task.completed ? '✕' : ''}
        </button>

        <span className={`priority-mark priority-mark--${task.priority.toLowerCase()}`} title={`Priority: ${task.priority}`}>
          {PRIORITY_MARK[task.priority]}
        </span>

        <div className="task-title-wrap">
          {editing ? (
            <input
              className="task-title-edit"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleEditKey}
            />
          ) : (
            <button
              className="task-title"
              onClick={() => setEditing(true)}
              title="Click to edit"
            >
              {task.title}
            </button>
          )}
          <span className="task-project-tag">{task.project}</span>
          {recurrenceTag && <span className="task-recur-tag">↻ {recurrenceTag}</span>}
        </div>

        {due && (
          <span className={`task-due task-due--${due.tone}`}>{due.text}</span>
        )}

        <span className="task-effort" title="Estimated focus units (25 min each)">
          {'▮'.repeat(Math.min(task.effortUnits || 1, 6))}
        </span>

        <span className="task-id">{idTag}</span>

        <button
          className="task-expand-toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label="Show details"
        >
          {expanded ? '︿' : '﹀'}
        </button>
      </div>

      {expanded && (
        <div className="task-row-details">
          {task.notes ? <p className="task-notes">{task.notes}</p> : <p className="task-notes task-notes--empty">No notes on this entry.</p>}
          <div className="task-row-detail-actions">
            <span className="task-meta">Opened {new Date(task.createdAt).toLocaleDateString()}</span>
            {task.completedAt && (
              <span className="task-meta">Settled {new Date(task.completedAt).toLocaleDateString()}</span>
            )}
            <button className="link-btn" onClick={() => onArchive(task.id)}>Archive</button>
            <button className="link-btn link-btn--danger" onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </div>
      )}
    </li>
  );
}
