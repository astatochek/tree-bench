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
    public title: string,
    public children: TreeNode[],
    public attributes: TreeNodeAttr[],
    public isExpanded = false,
    public isSelfEdited = false,
    public isEditedRecursive = false,
  ) {}

  // Logic from original: expanded ? self : recursive
  isEdited(): boolean {
    return this.isExpanded ? this.isSelfEdited : this.isEditedRecursive;
  }

  static fromRaw(node: RawTreeNode): TreeNode {
    return new TreeNode(
      node.title,
      node.children?.map(TreeNode.fromRaw) ?? [],
      node.attributes?.map(TreeNodeAttr.fromRaw) ?? [],
    );
  }

  /**
   * Updates an attribute value at the end of the path.
   * Path format: [childIdx, childIdx, ..., attrIdx]
   */
  updateAttribute(path: number[], value: string): void {
    if (path.length === 1) {
      const attrIdx = path[0];
      this.attributes[attrIdx].value = value;
      this.attributes[attrIdx].isEdited = true;
      this.refreshFlags(true);
    } else {
      const [head, ...tail] = path;
      this.children[head].updateAttribute(tail, value);
      this.refreshFlags(false);
    }
  }

  clearAttribute(path: number[]): void {
    if (path.length === 1) {
      const attrIdx = path[0];
      this.attributes[attrIdx].isEdited = false;
    } else {
      const [head, ...tail] = path;
      this.children[head].clearAttribute(tail);
    }
    this.refreshFlags(false);
  }

  /**
   * Toggles expansion at the specified node path.
   */
  toggleExpanded(path: number[]): void {
    if (path.length === 0) {
      this.isExpanded = !this.isExpanded;
    } else {
      const [head, ...tail] = path;
      this.children[head].toggleExpanded(tail);
    }
  }

  /**
   * Re-calculates edit flags for this node based on its attributes and children.
   */
  private refreshFlags(wasEdited: boolean) {
    if (wasEdited) {
      this.isSelfEdited = true;
      this.isEditedRecursive = true;
    } else {
      this.isSelfEdited = this.attributes.some((a) => a.isEdited);
      this.isEditedRecursive = this.isSelfEdited || this.children.some((c) => c.isEditedRecursive);
    }
  }

  toDisplayed(path: number[] = []): DisplayedTreeNode {
    return {
      title: this.title,
      hasChildren: this.children.length !== 0,
      isExpanded: this.isExpanded,
      isEdited: this.isEdited(),
      path,
      children: this.isExpanded ? this.children.map((c, i) => c.toDisplayed([...path, i])) : [],
    };
  }

  attrsToDisplayed(path: number[]): DisplayedTreeNodeAttr[] {
    return this.attributes.map((attr, i) => attr.toDisplayed([...path, i]));
  }
}

export class TreeNodeAttr {
  constructor(
    public title: string,
    public value: string,
    public isEdited = false,
  ) {}

  static fromRaw(attr: RawTreeNodeAttr): TreeNodeAttr {
    return new TreeNodeAttr(attr.title, attr.value);
  }

  toDisplayed(path: number[]): DisplayedTreeNodeAttr {
    return { ...this, path };
  }
}

// --- Types & Support ---

export type DisplayedTreeNodeAttr = {
  title: string;
  isEdited: boolean;
  value: string;
  path: number[];
};

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
