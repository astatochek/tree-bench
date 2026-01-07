export interface TreeNodeAttribute {
  title: string;
  value: string;
  isEdited: boolean;
}

export type Nil = null | undefined;

export interface TreeNode {
  title: string;
  isExpanded: boolean;
  attributes: TreeNodeAttribute[];
  children: TreeNode[];
}

// Example: [0, 2, 1] means: root.children[0].children[2].children[1]
export type NodePath = number[];

export function getNodeByPath(root: TreeNode, path: NodePath): TreeNode | Nil {
  let currentNode: TreeNode | Nil = root;

  for (const index of path) {
    if (!currentNode || !currentNode.children || index >= currentNode.children.length) {
      return null;
    }
    currentNode = currentNode.children[index];
  }

  return currentNode;
}

export function updateNodeAtPath(
  root: TreeNode,
  path: NodePath,
  updateFn: (node: TreeNode) => TreeNode,
): TreeNode {
  if (path.length === 0) {
    return updateFn(root);
  }

  const [firstIndex, ...restPath] = path;

  return {
    ...root,
    children: root.children.map((child, index) =>
      index === firstIndex ? updateNodeAtPath(child, restPath, updateFn) : child,
    ),
  };
}

export function calculateIsEdited(node: TreeNode): boolean {
  // Check node's own attributes
  const ownEdited = node.attributes.some((attr) => attr.isEdited);

  if (node.isExpanded) {
    // If expanded, only check own attributes
    return ownEdited;
  }

  // If collapsed, check all descendants
  const hasEditedDescendant = checkDescendantsEdited(node);
  return ownEdited || hasEditedDescendant;
}

function checkDescendantsEdited(node: TreeNode): boolean {
  // Check direct children recursively
  return node.children.some(
    (child) => child.attributes.some((attr) => attr.isEdited) || checkDescendantsEdited(child),
  );
}

export type RawTreeNode = {
  title: string;
  children?: RawTreeNode[];
  attributes?: { title: string; value: string }[];
};

export function parse(raw: RawTreeNode): TreeNode {
  return {
    title: raw.title,
    isExpanded: false,
    children: raw.children?.map(parse) ?? [],
    attributes: raw.attributes?.map((attr) => ({ ...attr, isEdited: false })) ?? [],
  };
}
