export function NumberField({ label, value, name, onChange, hint, step = "1" }) {
  return (
    <label className="field-group">
      <span className="field-label">
        <span>{label}</span>
        {hint ? <span className="field-hint">{hint}</span> : null}
      </span>
      <input className="field-input" type="number" name={name} value={value} onChange={onChange} step={step} />
    </label>
  );
}

export function TextField({ label, value, name, onChange, hint = null, placeholder = "" }) {
  return (
    <label className="field-group">
      <span className="field-label">
        <span>{label}</span>
        {hint ? <span className="field-hint">{hint}</span> : null}
      </span>
      <input className="field-input" type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}

export function ToggleField({ label, value, name, onChange }) {
  return (
    <label className="field-group">
      <span className="field-label">
        <span>{label}</span>
      </span>
      <select className="field-select" name={name} value={String(value)} onChange={onChange}>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  );
}

export function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </article>
  );
}
