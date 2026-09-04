import React, { useEffect, useRef, useState } from 'react';

const UNIT_SECONDS = 25 * 60;

export default function FocusStamp({ tasks, onToggle }) {
  const [activeId, setActiveId] = useState(null);
  const [remaining, setRemaining] = useState(UNIT_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const pending = tasks.filter((t) => !t.completed);
  const activeTask = pending.find((t) => t.id === activeId) || null;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function start(id) {
    setActiveId(id);
    setRemaining(UNIT_SECONDS);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
    clearInterval(intervalRef.current);
  }

  function resume() {
    if (remaining > 0) setRunning(true);
  }

  function reset() {
    stop();
    setRemaining(UNIT_SECONDS);
  }

  function finishAndComplete() {
    if (activeTask) onToggle(activeTask.id);
    stop();
    setActiveId(null);
    setRemaining(UNIT_SECONDS);
  }

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const isDone = remaining === 0;

  return (
    <aside className="focus-stamp" aria-label="Focus session">
      <div className="focus-stamp-head">
        <span className="focus-stamp-title">Focus stamp</span>
        <span className="focus-stamp-hint">one 25-minute mark per unit</span>
      </div>

      {!activeTask ? (
        <div className="focus-picker">
          <p className="focus-picker-hint">Pick an outstanding entry to time.</p>
          <ul className="focus-picker-list">
            {pending.slice(0, 5).map((t) => (
              <li key={t.id}>
                <button className="focus-picker-item" onClick={() => start(t.id)}>
                  <span>{t.title}</span>
                  <span className="focus-picker-arrow">start →</span>
                </button>
              </li>
            ))}
            {pending.length === 0 && <li className="focus-picker-empty">Nothing outstanding to time.</li>}
          </ul>
        </div>
      ) : (
        <div className="focus-active">
          <p className="focus-active-title">{activeTask.title}</p>
          <div className={`focus-clock ${isDone ? 'focus-clock--done' : ''}`}>
            {mins}:{secs}
          </div>
          <div className="focus-controls">
            {!running && !isDone && (
              <button className="btn btn--ink" onClick={resume}>
                {remaining === UNIT_SECONDS ? 'Begin' : 'Resume'}
              </button>
            )}
            {running && (
              <button className="btn btn--ghost" onClick={stop}>Pause</button>
            )}
            <button className="btn btn--ghost" onClick={reset}>Reset</button>
            <button className="btn btn--text" onClick={() => { stop(); setActiveId(null); }}>
              Switch entry
            </button>
          </div>
          {isDone && (
            <button className="btn btn--stamp" onClick={finishAndComplete}>
              Stamp settled
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
