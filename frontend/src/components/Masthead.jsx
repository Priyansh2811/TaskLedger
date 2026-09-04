import React from 'react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Masthead({ stats }) {
  const now = new Date();
  const dayName = DAY_NAMES[now.getDay()];
  const dateStr = `${MONTH_NAMES[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <header className="masthead">
      <div className="masthead-top">
        <div className="masthead-title-block">
          <h1 className="masthead-title">Task Ledger</h1>
          <p className="masthead-sub">A running account of what's owed to the day</p>
        </div>
        <div className="masthead-date">
          <span className="masthead-day">{dayName}</span>
          <span className="masthead-full-date">{dateStr}</span>
        </div>
      </div>

      {stats && (
        <div className="ledger-tally" role="group" aria-label="Task summary">
          <TallyItem label="On the books" value={stats.total} />
          <TallyItem label="Settled" value={stats.completed} accent="green" />
          <TallyItem label="Outstanding" value={stats.pending} accent="gold" />
          <TallyItem label="Due today" value={stats.dueToday} accent="red" />
          <TallyItem label="Overdue" value={stats.overdue} accent="red" strong={stats.overdue > 0} />
          <TallyItem label="Focus units queued" value={stats.focusUnitsToday} suffix="× 25min" />
        </div>
      )}
    </header>
  );
}

function TallyItem({ label, value, accent, suffix, strong }) {
  return (
    <div className={`tally-item ${strong ? 'tally-item--flag' : ''}`}>
      <span className={`tally-value ${accent ? `tally-value--${accent}` : ''}`}>
        {value ?? '—'}
        {suffix ? <span className="tally-suffix"> {suffix}</span> : null}
      </span>
      <span className="tally-label">{label}</span>
    </div>
  );
}
