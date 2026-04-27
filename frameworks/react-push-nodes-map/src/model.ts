export type DisplayedTreeNode = {
  id: string;
  title: string;
  hasChildren: boolean;
  style: string;
  isEdited: boolean;
  isExpanded: boolean;
};

export type DisplayedTreeNodeAttr = {
  id: string;
  parentId: string;
  title: string;
  isEdited: boolean;
  value: string;
};

export type TreeNode = {
  id: string;
  parentId: string | Nil;
  childrenIds: string[];
  title: string;
  attributes: TreeNodeAttr[];
  isExpanded: boolean;
  isSelfEdited: boolean;
  isSubtreeEdited: boolean;
};

export type TreeNodeAttr = {
  parentId: string;
  id: string;
  title: string;
  value: string;
  isEdited: boolean;
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

let count = 0;
function genId(): string {
  return `${count++}`;
}

function margin(offset: number): string {
  return `margin-left: ${offset * 10}px;`;
}

export class Tree {
  constructor(
    private readonly all: Map<string, TreeNode>,
    private readonly rootId: string,
  ) {}

  static fromDto(tree: RawTreeNode): Tree {
    const all = new Map<string, TreeNode>();
    let rootId: string;

    function traverse(raw: RawTreeNode, parent: TreeNode | Nil) {
      const id = genId();
      parent?.childrenIds.push(id);
      if (!parent) {
        rootId = id;
      }
      const childrenIds: string[] = [];
      const node: TreeNode = {
        id,
        parentId: parent?.id,
        title: raw.title,
        attributes: raw.attributes?.map((a) => attributeFromDto(a, id)) ?? [],
        isExpanded: false,
        isSelfEdited: false,
        isSubtreeEdited: false,
        childrenIds,
      };
      all.set(id, node);
      for (const child of raw.children ?? []) {
        traverse(child, node);
      }
    }

    function attributeFromDto({ title, value }: RawTreeNodeAttr, parentId: string): TreeNodeAttr {
      return { id: genId(), parentId, value, title, isEdited: false };
    }

    traverse(tree, null);

    return new Tree(all, rootId!);
  }

  attributes(nodeId: string): DisplayedTreeNodeAttr[] {
    const node = this.all.get(nodeId);
    if (!node) return [];
    return node.attributes;
  }

  nodeTitle(nodeId: string): string | Nil {
    const node = this.all.get(nodeId);
    if (!node) return;
    return node.title;
  }

  edit(nodeId: string, attrId: string, value: string): Tree {
    const node = this.all.get(nodeId);
    if (!node) return this;
    const attr = node.attributes.find((attr) => attr.id === attrId);
    if (!attr) return this;

    attr.value = value;
    attr.isEdited = true;
    node.isSelfEdited = true;

    let current: TreeNode | Nil = node;
    while (current) {
      const wasSubtreeEdited = current.isSubtreeEdited;
      current.isSubtreeEdited = true;

      if (wasSubtreeEdited) break;

      current = current.parentId ? this.all.get(current.parentId) : void 0;
    }
    return this.clone();
  }

  toggle(nodeId: string): Tree {
    const node = this.all.get(nodeId);
    if (!node) return this;
    node.isExpanded = !node.isExpanded;
    return this.clone();
  }

  flatten(): DisplayedTreeNode[] {
    const res: DisplayedTreeNode[] = [];
    const root = this.all.get(this.rootId);
    if (!root) return res;

    function traverse(currentId: string, offset: number, all: Map<string, TreeNode>): void {
      const node = all.get(currentId);
      if (!node) return;
      res.push({
        id: node.id,
        title: node.title,
        hasChildren: node.childrenIds.length > 0,
        style: margin(offset),
        isExpanded: node.isExpanded,
        isEdited: node.isExpanded ? node.isSelfEdited : node.isSubtreeEdited,
      });

      if (!node.isExpanded) return;

      for (const childId of node.childrenIds) {
        traverse(childId, offset + 1, all);
      }
    }

    traverse(root.id, 0, this.all);

    return res;
  }

  private clone(): Tree {
    return new Tree(this.all, this.rootId);
  }
}
