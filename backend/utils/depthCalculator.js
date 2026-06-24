/**
 * Builds the nested tree object for a component, starting from its root,
 * using directed parent->child edges. Also computes the depth (node count
 * on the longest root-to-leaf path).
 *
 * Only called for non-cyclic components (cycles return tree: {} elsewhere).
 *
 * @param {string} root
 * @param {Map<string, string>} childToParent  // child -> parent
 * @returns {{ tree: object, depth: number }}
 */
function buildTreeAndDepth(root, childToParent) {
  // Build a forward lookup: parent -> [children], derived from child->parent
  const parentToChildren = new Map();
  for (const [child, parent] of childToParent.entries()) {
    if (!parentToChildren.has(parent)) {
      parentToChildren.set(parent, []);
    }
    parentToChildren.get(parent).push(child);
  }

  /**
   * Recursively builds the nested object for a given node,
   * returning both the subtree and its depth.
   */
  function buildNode(node) {
    const children = parentToChildren.get(node) || [];

    if (children.length === 0) {
      return { subtree: {}, depth: 1 };
    }

    const subtree = {};
    let maxChildDepth = 0;

    for (const childNode of children) {
      const { subtree: childSubtree, depth: childDepth } = buildNode(childNode);
      subtree[childNode] = childSubtree;
      if (childDepth > maxChildDepth) {
        maxChildDepth = childDepth;
      }
    }

    return { subtree, depth: 1 + maxChildDepth };
  }

  const { subtree, depth } = buildNode(root);

  // Per spec example: tree is wrapped under the root key itself
  // e.g. { "A": { "B": {...}, "C": {...} } }
  const tree = { [root]: subtree };

  return { tree, depth };
}

module.exports = { buildTreeAndDepth };