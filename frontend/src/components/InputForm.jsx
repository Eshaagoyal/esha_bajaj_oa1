import { useState } from "react";

const PLACEHOLDER_EXAMPLE = `A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->H
G->I
hello
1->2
A->`;

function InputForm({ onSubmit, loading }) {
  const [rawText, setRawText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Split user input into individual entries.
    // Accepts entries separated by newlines AND/OR commas.
    const entries = rawText
      .split(/[\n,]+/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    if (entries.length === 0) {
      return; // nothing to submit
    }

    onSubmit(entries);
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <label htmlFor="nodeInput">
        Enter node relationships (one per line, or comma-separated):
      </label>
      <textarea
        id="nodeInput"
        rows={8}
        placeholder={PLACEHOLDER_EXAMPLE}
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>
    </form>
  );
}

export default InputForm;