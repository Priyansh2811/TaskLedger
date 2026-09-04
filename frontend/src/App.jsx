import React, { useMemo, useState } from 'react';
import Masthead from './components/Masthead.jsx';
import Composer from './components/Composer.jsx';
import FilterRail from './components/FilterRail.jsx';
import LedgerList from './components/LedgerList.jsx';
import FocusStamp from './components/FocusStamp.jsx';
import { useTasks } from './hooks/useTasks.js';
import './styles/app.css';

const PRIORITY_ORDER = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr + 'T00:00:00');
  return d.toDateString() === today.toDateString();
}

function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T00:00:00');
  return d >= today;
}

export default function App() {
  const {
    tasks,
    stats,
    loading,
    error,
    createTask,
    updateTask,
    toggleTask,
    archiveTask,
    deleteTask,
    reorderTasks,
  } = useTasks();

  const [view, setView] = useState('today');
  const [activeProject, setActiveProject] = useState('all');
  const [sort, setSort] = useState('manual');

  const projects = useMemo(() => {
    const set = new Set(tasks.map((t) => t.project));
    return Array.from(set).sort();
  }, [tasks]);

  const filtered = useMemo(() => {
    let list = tasks;

    if (view === 'today') {
      list = list.filter((t) => !t.completed && (isToday(t.dueDate) || !t.dueDate));
    } else if (view === 'upcoming') {
      list = list.filter((t) => !t.completed && isUpcoming(t.dueDate) && !isToday(t.dueDate));
    } else if (view === 'completed') {
      list = list.filter((t) => t.completed);
    } else {
      list = list.filter((t) => !t.completed);
    }

    if (activeProject !== 'all') {
      list = list.filter((t) => t.project === activeProject);
    }

    const arr = [...list];
    if (sort === 'due') {
      arr.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else if (sort === 'priority') {
      arr.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    } else if (sort === 'created') {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }
    return arr;
  }, [tasks, view, activeProject, sort]);

  return (
    <div className="page ledger-bg">
      <div className="page-inner">
        <Masthead stats={stats} />

        {error && (
          <div className="error-banner" role="alert">
            <strong>Couldn't reach the backend.</strong> {error} Check that the Spring Boot
            service is running on port 8080.
          </div>
        )}

        <Composer onCreate={createTask} projects={['General', ...projects.filter((p) => p !== 'General')]} />

        <div className="workspace">
          <FilterRail
            view={view}
            onViewChange={setView}
            projects={projects}
            activeProject={activeProject}
            onProjectChange={setActiveProject}
            sort={sort}
            onSortChange={setSort}
          />

          <div className="workspace-main">
            {loading ? (
              <div className="loading-line">Opening the ledger…</div>
            ) : (
              <LedgerList
                tasks={filtered}
                onToggle={toggleTask}
                onUpdate={updateTask}
                onArchive={archiveTask}
                onDelete={deleteTask}
                onReorder={reorderTasks}
                sortable={sort === 'manual'}
              />
            )}
          </div>

          <FocusStamp tasks={tasks} onToggle={toggleTask} />
        </div>

        <footer className="page-footer">
          <span>Task Ledger. Kept locally, entry by entry.</span>
        </footer>
      </div>
    </div>
  );
}
