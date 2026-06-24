/**
 * Recursively renders a nested tree object.
 * Each key is a node label; its value is an object of children
 * (empty object {} means it's a leaf node).
 *
 * Example input: { A: { B: {}, C: { E: {} } } }
 */
function TreeView({ tree }) {
  const nodeNames = Object.keys(tree);

  if (nodeNames.length === 0) {
    return null;
  }

  return (
    <ul className="tree-view">
      {nodeNames.map((nodeName) => {
        const children = tree[nodeName];
        const hasChildren = Object.keys(children).length > 0;

        return (
          <li key={nodeName}>
            <span className="tree-node">{nodeName}</span>
            {hasChildren && <TreeView tree={children} />}
          </li>
        );
      })}
    </ul>
  );
}

export default TreeView;