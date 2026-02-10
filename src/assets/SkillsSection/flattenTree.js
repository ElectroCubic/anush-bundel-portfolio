function flattenTree(root) {
  const nodes = [];
  const edges = [];
  const parentById = new Map();

  const stack = [{ node: root, parent: null }];

  while (stack.length) {
    const { node, parent } = stack.pop();

    nodes.push(node);
    if (parent) {
      edges.push([parent.id, node.id]);
      parentById.set(node.id, parent.id);
    } else {
      parentById.set(node.id, null);
    }

    const children = node.children ?? [];
    for (let i = children.length - 1; i >= 0; i--) {
      stack.push({ node: children[i], parent: node });
    }
  }

  return { nodes, edges, parentById };
}
export default flattenTree