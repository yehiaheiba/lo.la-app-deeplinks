export default function HomePage() {
  return (
    <main className="container">
      <div className="card">
        <h1>Deep link demo</h1>
        <p className="muted">
          Try opening a deep link landing page like{" "}
          <a className="mono" href="/d/product/123?ref=web">
            /d/product/123?ref=web
          </a>
          .
        </p>
      </div>
    </main>
  );
}


