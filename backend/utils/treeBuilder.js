const { validateEntry } = require("./validator");

/**
 * Processes raw entries: separates invalid ones, detects duplicate edges,
 * resolves multi-parent conflicts (first parent wins), and groups nodes
 * into connected components ready for tree/cycle analysis.
 *
 * @param {string[]} rawData
 * @returns {{
 *   invalidEntries: string[],
 *   duplicateEdges: string[],
 *   edges: Map<string, string>,   // child -> parent (resolved, first-wins)
 *   allNodes: Set<string>
 * }}
 */
function processEntries(rawData) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();      // tracks "Parent->Child" strings already accepted
  const childToParent = new Map();  // child -> parent (first parent wins)
  const allNodes = new Set();

  for (const rawEntry of rawData) {
    const { valid, parent, child } = validateEntry(rawEntry);

    if (!valid) {
      invalidEntries.push(rawEntry);
      continue;
    }

    const edgeKey = `${parent}->${child}`;

    // Duplicate edge check: same exact Parent->Child pair seen before
    if (seenEdges.has(edgeKey)) {
      duplicateEdges.push(edgeKey);
      continue;
    }
    seenEdges.add(edgeKey);

    allNodes.add(parent);
    allNodes.add(child);

    // Multi-parent conflict: this child already has a DIFFERENT parent
    // from an earlier edge -> first-encountered parent wins, discard silently
    if (childToParent.has(child)) {
      continue; // silently discarded, not pushed anywhere
    }

    childToParent.set(child, parent);
  }

  return { invalidEntries, duplicateEdges, edges: childToParent, allNodes };
}

module.exports = { processEntries };