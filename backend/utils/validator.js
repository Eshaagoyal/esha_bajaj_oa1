/**
 * Validates a single raw entry against the required format: X->Y
 * where X and Y are each exactly one uppercase letter (A-Z),
 * and X !== Y (self-loops are invalid).
 *
 * Whitespace is trimmed BEFORE validation, per spec:
 * " A->B " should be treated the same as "A->B".
 *
 * @param {string} rawEntry
 * @returns {{ valid: boolean, parent: string|null, child: string|null }}
 */
function validateEntry(rawEntry) {
  // Guard against non-string input defensively
  if (typeof rawEntry !== "string") {
    return { valid: false, parent: null, child: null };
  }

  const trimmed = rawEntry.trim();

  // Empty string after trimming -> invalid
  if (trimmed.length === 0) {
    return { valid: false, parent: null, child: null };
  }

  // Strict pattern: exactly one uppercase letter, "->", exactly one uppercase letter
  const pattern = /^([A-Z])->([A-Z])$/;
  const match = trimmed.match(pattern);

  if (!match) {
    return { valid: false, parent: null, child: null };
  }

  const [, parent, child] = match;

  // Self-loop check: A->A is explicitly invalid per spec
  if (parent === child) {
    return { valid: false, parent: null, child: null };
  }

  return { valid: true, parent, child };
}

module.exports = { validateEntry };