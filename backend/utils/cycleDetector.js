/**
 * Given the resolved edges (child -> parent) and the full set of nodes,
 * groups nodes into connected components, then classifies each component
 * as either a valid tree (with a root) or a cycle.
 *
 * @param {Map<string, string>} childToParent
 * @param {Set<string>} allNodes
 * @returns {Array<{ nodes: string[], hasCycle: boolean, root: string }>}
 */
function findComponents(childToParent, allNodes) {
  // Build an undirected adjacency map purely for grouping connected nodes
  // (a node and its parent/child belong to the same component regardless of direction)
  const adjacency = new Map();
  for (const node of allNodes) {
    adjacency.set(node, new Set());
  }
  for (const [child, parent] of childToParent.entries()) {
    adjacency.get(parent).add(child);
    adjacency.get(child).add(parent);
  }

  const visited = new Set();
  const components = [];

  for (const node of allNodes) {
    if (visited.has(node)) continue;

    // BFS to collect all nodes in this connected component
    const componentNodes = [];
    const queue = [node];
    visited.add(node);

    while (queue.length > 0) {
      const current = queue.shift();
      componentNodes.push(current);
      for (const neighbor of adjacency.get(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    components.push(classifyComponent(componentNodes, childToParent));
  }

  return components;
}

/**
 * Classifies a single connected component: finds its root (a node with
 * no parent), and determines whether it contains a cycle.
 *
 * A component has a cycle if EVERY node in it has a parent (i.e. no root exists)
 * - because with N nodes and N parent-edges all internal, a loop is unavoidable.
 *
 * @param {string[]} componentNodes
 * @param {Map<string, string>} childToParent
 * @returns {{ nodes: string[], hasCycle: boolean, root: string }}
 */
function classifyComponent(componentNodes, childToParent) {
  const rootCandidates = componentNodes.filter(
    (n) => !childToParent.has(n)
  );

  if (rootCandidates.length === 0) {
    // No node is parent-less -> pure cycle, no natural root.
    // Use lexicographically smallest node as the stand-in root label.
    const sorted = [...componentNodes].sort();
    return { nodes: componentNodes, hasCycle: true, root: sorted[0] };
  }

  // Normal case: exactly one parent-less node = the real root.
  // (With first-parent-wins conflict resolution already applied upstream,
  // each child has at most one parent, so a connected component with a
  // root cannot also contain a cycle.)
  return { nodes: componentNodes, hasCycle: false, root: rootCandidates[0] };
}

module.exports = { findComponents };