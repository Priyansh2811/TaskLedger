import React, { useRef, useState } from 'react';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const RECURRENCE_LABELS = {
  NONE: 'One time',
  DAILY: 'Repeats daily',
  WEEKDAYS: 'Repeats weekdays',
  WEEKLY: 'Repeats weekly',
};

export default function Composer({ onCreate, projects }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [project, setProject] = useState('General');
  const [customProject, setCustomProject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [effortUnits, setEffortUnits] = useState(1);
  const [recurrence, setRecurrence] = useState('NONE');
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef(null);

  function openComposer() {
    setOpen(true);
    setTimeout(() => titleRef.current?.focus(), 50);
  }

  function reset() {
    setTitle('');
    setNotes('');
    setPriority('MEDIUM');
    setProject('General');
    setCustomProject('');
    setDueDate('');
    setEffortUnits(1);
    setRecurrence('NONE');
  }

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    const finalProject = project === '__custom__' ? (customProject.trim() || 'General') : project;
    try {
      await onCreate({
        title: title.trim(),
        notes: notes.trim() || null,
        priority,
        project: finalProject,
        dueDate: dueDate || null,
        effortUnits: Number(effortUnits) || 1,
        recurrence,
      });
      reset();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button className="composer-trigger" onClick={openComposer} aria-expanded="false">
        <span className="composer-trigger-mark" aria-hidden="true">+</span>
        <span>Enter a new line</span>
      </button>
    );
  }

  return (
    <form className="composer" onSubmit={submit}>
      <div className="composer-row composer-row--main">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          className="composer-title-input"
          maxLength={500}
          required
        />
      </div>

      <div className="composer-row">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="composer-notes-input"
          rows={2}
          maxLength={2000}
        />
      </div>

      <div className="composer-grid">
        <fieldset className="composer-field">
          <legend>Priority</legend>
          <div className="pill-group">
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p}
                className={`pill pill--${p.toLowerCase()} ${priority === p ? 'pill--active' : ''}`}
                onClick={() => setPriority(p)}
                aria-pressed={priority === p}
              >
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="composer-field">
          <legend>Project</legend>
          <select value={project} onChange={(e) => setProject(e.target.value)} className="composer-select">
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
            <option value="__custom__">New project…</option>
          </select>
          {project === '__custom__' && (
            <input
              type="text"
              value={customProject}
              onChange={(e) => setCustomProject(e.target.value)}
              placeholder="Project name"
              className="composer-select"
              style={{ marginTop: '0.4rem' }}
            />
          )}
        </fieldset>

        <fieldset className="composer-field">
          <legend>Due date</legend>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="composer-select"
          />
        </fieldset>

        <fieldset className="composer-field">
          <legend>Focus units</legend>
          <div className="stepper">
            <button type="button" onClick={() => setEffortUnits((v) => Math.max(1, v - 1))} aria-label="Decrease focus units">−</button>
            <span className="stepper-value">{effortUnits}</span>
            <button type="button" onClick={() => setEffortUnits((v) => Math.min(12, v + 1))} aria-label="Increase focus units">+</button>
          </div>
        </fieldset>

        <fieldset className="composer-field">
          <legend>Recurrence</legend>
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className="composer-select">
            {Object.entries(RECURRENCE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </fieldset>
      </div>

      <div className="composer-actions">
        <button type="button" className="btn btn--ghost" onClick={() => { reset(); setOpen(false); }}>
          Discard
        </button>
        <button type="submit" className="btn btn--ink" disabled={!title.trim() || submitting}>
          {submitting ? 'Recording…' : 'Record entry'}
        </button>
      </div>
    </form>
  );
}
