export type DisplayedTreeNode = {
  title: string;
  hasChildren: boolean;
  children: DisplayedTreeNode[];
  isEdited: boolean;
  path: number[];
  isExpanded: boolean;
};

export class TreeNode {
  constructor(
    readonly title: string,
    readonly children: TreeNode[],
    readonly attributes: TreeNodeAttr[],
    readonly isExpanded = false,
  ) {}

  isEdited(): boolean {
    return this.isExpanded ? this.isSelfEdited() : this.isEditedRecursive();
  }

  private isSelfEdited(): boolean {
    return this.attributes.some((attr) => attr.isEdited);
  }

  private isEditedRecursive(): boolean {
    return this.isSelfEdited() || this.isSomeChildEdited();
  }

  private isSomeChildEdited(): boolean {
    return this.children.some((c) => c.isEditedRecursive());
  }

  static fromRaw(node: RawTreeNode): TreeNode {
    return new TreeNode(
      node.title,
      node.children?.map(TreeNode.fromRaw) ?? [],
      node.attributes?.map(TreeNodeAttr.fromRaw) ?? [],
    );
  }

  toDisplayed(path: number[]): DisplayedTreeNode {
    return {
      title: this.title,
      hasChildren: this.children.length !== 0,
      children: this.isExpanded
        ? this.children.map((c, index) => c.toDisplayed([...path, index]))
        : [],
      path,
      isEdited: this.isEdited(),
      isExpanded: this.isExpanded,
    };
  }

  attrsToDisplayed(path: number[]): DisplayedTreeNodeAttr[] {
    return this.attributes.map((attr, index) => attr.toDisplayed([...path, index]));
  }
}

export type DisplayedTreeNodeAttr = {
  title: string;
  isEdited: boolean;
  value: string;
  path: number[];
};

export class TreeNodeAttr {
  constructor(
    readonly title: string,
    readonly value: string,
    readonly isEdited = false,
  ) {}

  static fromRaw(attr: RawTreeNodeAttr): TreeNodeAttr {
    return new TreeNodeAttr(attr.title, attr.value);
  }

  toDisplayed(path: number[]): DisplayedTreeNodeAttr {
    return { ...this, path };
  }
}

export type RawTreeNode = {
  title: string;
  attributes?: RawTreeNodeAttr[];
  children?: RawTreeNode[];
};

export type RawTreeNodeAttr = {
  title: string;
  value: string;
};

export type Nil = null | undefined;

export function findNodeByPath(root: TreeNode, path: number[]): TreeNode | Nil {
  let node: TreeNode | Nil = root;
  for (const pos of path) {
    node = node?.children.at(pos);
    if (!node) {
      return;
    }
  }
  return node;
}

export function setAttrValueAndUpdateTree(path: number[], root: TreeNode, value: string): TreeNode {
  const nodePath = path.slice(0, -1);
  const attrPos = path.at(-1)!;

  const nodesInPath: TreeNode[] = [root];
  for (const pos of nodePath) {
    nodesInPath.push(nodesInPath.at(-1)!.children[pos]);
  }

  const node = nodesInPath.at(-1)!;
  nodesInPath[nodesInPath.length - 1] = updateTreeNodeAttr(node, attrPos, value);

  let indexInPath = nodesInPath.length - 2;
  while (indexInPath >= 0) {
    nodesInPath[indexInPath] = updateTreeNodeChild(
      nodesInPath[indexInPath],
      nodesInPath[indexInPath + 1],
      nodePath[indexInPath],
    );
    indexInPath--;
  }

  return nodesInPath[0];
}

export function setExpandedAndUpdateTree(nodePath: number[], root: TreeNode): TreeNode {
  const nodesInPath: TreeNode[] = [root];
  for (const pos of nodePath) {
    nodesInPath.push(nodesInPath.at(-1)!.children[pos]);
  }

  const node = nodesInPath.at(-1)!;
  nodesInPath[nodesInPath.length - 1] = toggleNodeExpand(node);

  let indexInPath = nodesInPath.length - 2;
  while (indexInPath >= 0) {
    nodesInPath[indexInPath] = updateTreeNodeChild(
      nodesInPath[indexInPath],
      nodesInPath[indexInPath + 1],
      nodePath[indexInPath],
    );
    indexInPath--;
  }

  return nodesInPath[0];
}

function updateTreeNodeAttr(node: TreeNode, pos: number, value: string): TreeNode {
  const prev = node.attributes[pos];
  const next = new TreeNodeAttr(prev.title, value, true);
  return new TreeNode(node.title, node.children, node.attributes.with(pos, next), node.isExpanded);
}

function toggleNodeExpand(node: TreeNode): TreeNode {
  return new TreeNode(node.title, node.children, node.attributes, !node.isExpanded);
}

function updateTreeNodeChild(node: TreeNode, child: TreeNode, pos: number): TreeNode {
  return new TreeNode(node.title, node.children.with(pos, child), node.attributes, node.isExpanded);
}
