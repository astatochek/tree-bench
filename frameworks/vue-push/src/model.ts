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
  path: NodePath;
  isOwnEdited: boolean;
  isEditedDescendant: boolean;
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
  checkEdited: boolean,
): TreeNode {
  if (path.length === 0) {
    return updateFn(root);
  }

  const [firstIndex, ...restPath] = path;

  const children = root.children.map((child, index) =>
    index === firstIndex ? updateNodeAtPath(child, restPath, updateFn, checkEdited) : child,
  );

  const isOwnEdited = checkEdited ? checkIsOwnEdited(root.attributes) : root.isOwnEdited;
  const isEditedDescendant = checkEdited
    ? checkDescendantsEdited(children)
    : root.isEditedDescendant;

  return {
    ...root,
    children,
    isOwnEdited,
    isEditedDescendant,
  };
}

export function checkIsOwnEdited(attributes: TreeNodeAttribute[]): boolean {
  return attributes.some((attr) => attr.isEdited);
}

export function checkDescendantsEdited(children: TreeNode[]): boolean {
  return children.some((child) => child.isOwnEdited || child.isEditedDescendant);
}

export type RawTreeNode = {
  title: string;
  children?: RawTreeNode[];
  attributes?: { title: string; value: string }[];
};

export function parse(raw: RawTreeNode, path: NodePath): TreeNode {
  return {
    title: raw.title,
    isExpanded: false,
    children: raw.children?.map((raw, index) => parse(raw, [...path, index])) ?? [],
    attributes: raw.attributes?.map((attr) => ({ ...attr, isEdited: false })) ?? [],
    path,
    isOwnEdited: false,
    isEditedDescendant: false,
  };
}
