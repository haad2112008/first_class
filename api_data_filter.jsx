import { useState, useEffect } from "react";

const FILTERS = ["All", "A–F", "G–M", "N–Z"];

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const RAMPS = [
  { bg: "#EEEDFE", border: "#534AB7", text: "#3C3489", dot: "#7F77DD" },
  { bg: "#E1F5EE", border: "#0F6E56", text: "#085041", dot: "#1D9E75" },
  { bg: "#FAECE7", border: "#993C1D", text: "#712B13", dot: "#D85A30" },
  { bg: "#FBEAF0", border: "#993556", text: "#72243E", dot: "#D4537E" },
  { bg: "#E6F1FB", border: "#185FA5", text: "#0C447C", dot: "#378ADD" },
  { bg: "#EAF3DE", border: "#3B6D11", text: "#27500A", dot: "#639922" },
  { bg: "#FAEEDA", border: "#854F0B", text: "#633806", dot: "#BA7517" },
];

function getColor(i) {
  return RAMPS[i % RAMPS.length];
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [alphaFilter, setAlphaFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => { setUsers(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const companies = ["All", ...Array.from(new Set(users.map(u => u.company.name))).sort()];

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q) ||
      u.address.city.toLowerCase().includes(q);

    const first = u.name[0].toUpperCase();
    const matchAlpha =
      alphaFilter === "All" ||
      (alphaFilter === "A–F" && first >= "A" && first <= "F") ||
      (alphaFilter === "G–M" && first >= "G" && first <= "M") ||
      (alphaFilter === "N–Z" && first >= "N" && first <= "Z");

    const matchCompany = companyFilter === "All" || u.company.name === companyFilter;

    return matchSearch && matchAlpha && matchCompany;
  });

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 1rem", maxWidth: 960, margin: "0 auto" }}>
      <h2 style={{ sr: "only", fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 0.25rem" }}>
        User Directory
      </h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
        {loading ? "Fetching from API…" : error ? "Error loading data" : `${filtered.length} of ${users.length} users`}
      </p>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "1.25rem" }}>
        <input
          type="text"
          placeholder="Search by name, email, city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: "1 1 220px", minWidth: 0 }}
        />
        <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} style={{ flex: "1 1 160px" }}>
          {companies.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Alpha filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setAlphaFilter(f)}
            style={{
              padding: "5px 14px",
              borderRadius: 999,
              border: alphaFilter === f ? "1.5px solid var(--color-border-primary)" : "0.5px solid var(--color-border-tertiary)",
              background: alphaFilter === f ? "var(--color-background-secondary)" : "transparent",
              fontWeight: alphaFilter === f ? 500 : 400,
              fontSize: 13,
              color: "var(--color-text-primary)",
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
        {(search || alphaFilter !== "All" || companyFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setAlphaFilter("All"); setCompanyFilter("All"); }}
            style={{
              padding: "5px 14px", borderRadius: 999,
              border: "0.5px solid var(--color-border-secondary)",
              background: "transparent", fontSize: 13,
              color: "var(--color-text-secondary)", cursor: "pointer",
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              height: 170, borderRadius: "var(--border-radius-lg)",
              border: "0.5px solid var(--color-border-tertiary)",
              background: "var(--color-background-secondary)",
              animation: "pulse 1.4s ease-in-out infinite",
            }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:.3}}`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "1rem", borderRadius: "var(--border-radius-md)", background: "var(--color-background-danger)", color: "var(--color-text-danger)", fontSize: 14 }}>
          {error} — check your network connection.
        </div>
      )}

      {/* Cards grid */}
      {!loading && !error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
            {filtered.map((user, i) => {
              const c = getColor(i);
              return (
                <div key={user.id} style={{
                  background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)",
                  padding: "1rem 1.25rem",
                  display: "flex", flexDirection: "column", gap: 10,
                  transition: "border-color 0.15s",
                }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                      background: c.bg, border: `1px solid ${c.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 500, color: c.text,
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {user.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>@{user.username}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
                    <Row icon="✉" label={user.email} />
                    <Row icon="☎" label={user.phone} />
                    <Row icon="📍" label={`${user.address.city}, ${user.address.zipcode}`} />
                    <Row icon="🔗" label={user.website} />
                  </div>

                  {/* Company badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 999,
                    background: c.bg, fontSize: 12, color: c.text,
                    fontWeight: 500, alignSelf: "flex-start",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
                    {user.company.name}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--color-text-secondary)", fontSize: 14 }}>
              No users match your filters.
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Row({ icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-secondary)" }}>
      <span style={{ fontSize: 12, width: 16, textAlign: "center" }}>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}
