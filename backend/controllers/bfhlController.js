const { processEntries } = require("../utils/treeBuilder");
const { findComponents } = require("../utils/cycleDetector");
const { buildTreeAndDepth } = require("../utils/depthCalculator");

// ---- Your identity fields (per spec: must be your actual credentials) ----
const STUDENT_INFO = {
  fullName: "esha",          // lowercase, no spaces
  dob: "23122004",           // DDMMYYYY
  email: "esha3818.beai23@chitkara.edu.in",
  rollNumber: "2310993818",
};

function handleBfhl(req, res) {
  try {
    const { data } = req.body;

    // Basic request shape validation
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        error: "Invalid request body. Expected { data: string[] }",
      });
    }

    // Step 1: validate entries, resolve duplicates & multi-parent conflicts
    const { invalidEntries, duplicateEdges, edges, allNodes } =
      processEntries(data);

    // Step 2: group nodes into connected components, classify cycle vs tree
    const components = findComponents(edges, allNodes);

    // Step 3: build hierarchies array
    const hierarchies = [];
    let totalTrees = 0;
    let totalCycles = 0;
    let largestTreeRoot = null;
    let largestDepth = -1;

    for (const component of components) {
      if (component.hasCycle) {
        hierarchies.push({
          root: component.root,
          tree: {},
          has_cycle: true,
        });
        totalCycles++;
        continue;
      }

      const { tree, depth } = buildTreeAndDepth(component.root, edges);

      hierarchies.push({
        root: component.root,
        tree,
        depth,
      });
      totalTrees++;

      // Track largest tree (deepest), tiebreak lexicographically smaller root
      if (
        depth > largestDepth ||
        (depth === largestDepth && component.root < largestTreeRoot)
      ) {
        largestDepth = depth;
        largestTreeRoot = component.root;
      }
    }

    // Step 4: assemble final response
    const response = {
      user_id: `${STUDENT_INFO.fullName}_${STUDENT_INFO.dob}`,
      email_id: STUDENT_INFO.email,
      college_roll_number: STUDENT_INFO.rollNumber,
      hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles,
        largest_tree_root: largestTreeRoot,
      },
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error in /bfhl:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { handleBfhl };