export default function DeepLinkLoading() {
  return (
    <main className="container">
      <div className="card" style={{ textAlign: "center" }}>
        <img
          src="/loading.gif"
          alt="Loading"
          width={160}
          height={160}
          style={{ display: "block", margin: "0 auto 12px auto" }}
        />
        <div className="muted">Opening the app…</div>
      </div>
    </main>
  );
}


