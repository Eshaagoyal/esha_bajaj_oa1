import TreeView from "./TreeView.jsx";

function ResultDisplay({ data }) {
  const {
    user_id,
    email_id,
    college_roll_number,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary,
  } = data;

  return (
    <div className="result-display">
      <section className="identity-card">
        <h2>Submission Info</h2>
        <p><strong>User ID:</strong> {user_id}</p>
        <p><strong>Email:</strong> {email_id}</p>
        <p><strong>Roll Number:</strong> {college_roll_number}</p>
      </section>

      <section className="summary-card">
        <h2>Summary</h2>
        <p><strong>Total Trees:</strong> {summary.total_trees}</p>
        <p><strong>Total Cycles:</strong> {summary.total_cycles}</p>
        <p><strong>Largest Tree Root:</strong> {summary.largest_tree_root ?? "N/A"}</p>
      </section>

      <section className="hierarchies-card">
        <h2>Hierarchies ({hierarchies.length})</h2>
        {hierarchies.length === 0 && <p className="empty-note">No hierarchies found.</p>}
        <div className="hierarchies-grid">
          {hierarchies.map((h, index) => (
            <div className="hierarchy-box" key={`${h.root}-${index}`}>
              <div className="hierarchy-box-header">
                <span className="root-label">Root: {h.root}</span>
                {h.has_cycle ? (
                  <span className="badge badge-cycle">Cycle</span>
                ) : (
                  <span className="badge badge-tree">Depth: {h.depth}</span>
                )}
              </div>
              {h.has_cycle ? (
                <p className="cycle-note">This group contains a cycle — no valid tree structure.</p>
              ) : (
                <TreeView tree={h.tree} />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="entries-card">
        <h2>Invalid Entries ({invalid_entries.length})</h2>
        {invalid_entries.length === 0 ? (
          <p className="empty-note">None</p>
        ) : (
          <ul className="entries-list">
            {invalid_entries.map((entry, index) => (
              <li key={index}>
                {entry === "" ? <em>(empty string)</em> : entry}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="entries-card">
        <h2>Duplicate Edges ({duplicate_edges.length})</h2>
        {duplicate_edges.length === 0 ? (
          <p className="empty-note">None</p>
        ) : (
          <ul className="entries-list">
            {duplicate_edges.map((edge, index) => (
              <li key={index}>{edge}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ResultDisplay;