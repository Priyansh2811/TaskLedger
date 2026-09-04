import React from 'react';

const VIEWS = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'all', label: 'All entries' },
  { key: 'completed', label: 'Settled' },
];

export default function FilterRail({
  view,
  onViewChange,
  projects,
  activeProject,
  onProjectChange,
  sort,
  onSortChange,
}) {
  return (
    <nav className="filter-rail" aria-label="Task filters">
      <div className="filter-group">
        <span className="filter-group-label">View</span>
        <div className="filter-tabs">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              className={`filter-tab ${view === v.key ? 'filter-tab--active' : ''}`}
              onClick={() => onViewChange(v.key)}
              aria-pressed={view === v.key}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-label">Project</span>
        <div className="filter-tabs filter-tabs--wrap">
          <button
            className={`filter-tab filter-tab--project ${activeProject === 'all' ? 'filter-tab--active' : ''}`}
            onClick={() => onProjectChange('all')}
            aria-pressed={activeProject === 'all'}
          >
            All
          </button>
          {projects.map((p) => (
            <button
              key={p}
              className={`filter-tab filter-tab--project ${activeProject === p ? 'filter-tab--active' : ''}`}
              onClick={() => onProjectChange(p)}
              aria-pressed={activeProject === p}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-label">Order by</span>
        <select
          className="composer-select filter-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="manual">Manual order</option>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
          <option value="created">Date entered</option>
        </select>
      </div>
    </nav>
  );
}
