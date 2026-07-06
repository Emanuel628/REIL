export function PageFrame({ kicker, title, copy, actions, children }) {
  return (
    <section className="page-frame">
      <header className="page-header">
        <div>
          <p className="panel-kicker">{kicker}</p>
          <h2 className="page-title">{title}</h2>
          <p className="page-copy">{copy}</p>
        </div>
        {actions ? <div className="page-actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function PlaceholderPanel({ title, copy, bullets, emphasis }) {
  return (
    <section className="panel">
      <div className="panel-inner placeholder-grid">
        <div>
          <h3 className="placeholder-title">{title}</h3>
          <p className="panel-copy">{copy}</p>
        </div>
        {bullets?.length ? (
          <ol className="signal-list">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ol>
        ) : null}
        {emphasis ? <div className="placeholder-emphasis">{emphasis}</div> : null}
      </div>
    </section>
  );
}
