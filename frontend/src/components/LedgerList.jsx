import React, { useRef, useState } from 'react';
import TaskRow from './TaskRow.jsx';

export default function LedgerList({ tasks, onToggle, onUpdate, onArchive, onDelete, onReorder, sortable }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const orderRef = useRef(tasks);
  orderRef.current = tasks;

  if (tasks.length === 0) {
    return (
      <div className="empty-ledger">
        <p className="empty-ledger-line">This page is blank.</p>
        <p className="empty-ledger-sub">Nothing filed here yet. Enter a new line above to open an account.</p>
      </div>
    );
  }

  const dragHandlers = {
    onDragStart: (e, index) => {
      if (!sortable) return;
      setDragIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    },
    onDragOver: (e, index) => {
      if (!sortable || dragIndex === null) return;
      e.preventDefault();
      if (index !== overIndex) setOverIndex(index);
    },
    onDrop: (e, index) => {
      if (!sortable || dragIndex === null) return;
      e.preventDefault();
      const list = [...orderRef.current];
      const [moved] = list.splice(dragIndex, 1);
      list.splice(index, 0, moved);
      setDragIndex(null);
      setOverIndex(null);
      onReorder(list.map((t) => t.id));
    },
    onDragEnd: () => {
      setDragIndex(null);
      setOverIndex(null);
    },
  };

  return (
    <ol className="ledger-list" aria-label="Task entries">
      {tasks.map((task, i) => (
        <TaskRow
          key={task.id}
          task={task}
          index={i}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onArchive={onArchive}
          onDelete={onDelete}
          dragHandlers={dragHandlers}
          isDragging={dragIndex === i}
          isDragOver={overIndex === i && dragIndex !== null && dragIndex !== i}
        />
      ))}
    </ol>
  );
}
