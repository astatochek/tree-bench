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
  entry: number;
  exit: number;
  depth: number;
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
    private readonly tour: string[],
    private readonly segmentTree: SubtreeEditSegmentTree,
  ) {}

  static fromDto(tree: RawTreeNode): Tree {
    const all = new Map<string, TreeNode>();
    let rootId: string;

    function parse(raw: RawTreeNode, parent: TreeNode | Nil) {
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
        childrenIds,
        entry: 0,
        exit: 0,
        depth: 0,
      };
      all.set(id, node);
      for (const child of raw.children ?? []) {
        parse(child, node);
      }
    }

    function attributeFromDto({ title, value }: RawTreeNodeAttr, parentId: string): TreeNodeAttr {
      return { id: genId(), parentId, value, title, isEdited: false };
    }

    parse(tree, null);

    const tour: string[] = [];
    let time = 0;

    function dfs(nodeId: string, depth: number) {
      const node = all.get(nodeId)!;
      node.entry = time++;
      node.depth = depth;
      tour.push(nodeId);

      for (const childId of node.childrenIds) {
        dfs(childId, depth + 1);
        time++;
        tour.push(nodeId);
      }
      node.exit = time - 1;
    }

    dfs(rootId!, 0);

    return new Tree(all, rootId!, tour, new SubtreeEditSegmentTree(tour.length));
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

    this.segmentTree.update(node.entry, true);

    return this;
  }

  toggle(nodeId: string): Tree {
    const node = this.all.get(nodeId);
    if (!node) return this;
    node.isExpanded = !node.isExpanded;
    return this;
  }

  flatten(): DisplayedTreeNode[] {
    const res: DisplayedTreeNode[] = [];
    const root = this.all.get(this.rootId);
    if (!root) return res;

    const traverse = (currentId: string, all: Map<string, TreeNode>): void => {
      const node = all.get(currentId);
      if (!node) return;
      res.push({
        id: node.id,
        title: node.title,
        hasChildren: node.childrenIds.length > 0,
        style: margin(node.depth),
        isExpanded: node.isExpanded,
        isEdited: this.isEdited(node),
      });

      if (!node.isExpanded) return;

      for (const childId of node.childrenIds) {
        traverse(childId, all);
      }
    };

    traverse(root.id, this.all);

    return res;
  }

  private isEdited(node: TreeNode): boolean {
    if (node.isSelfEdited) return true;
    if (node.isExpanded) return false;

    return this.segmentTree.query(node.entry, node.exit);
  }
}

class SubtreeEditSegmentTree {
  private readonly tree: boolean[] = [];

  constructor(private n: number) {
    this.tree = new Array(n * 4).fill(false);
  }

  update(index: number, value: boolean) {
    this._update(1, 0, this.n - 1, index, value);
  }

  query(left: number, right: number): boolean {
    return this._query(1, 0, this.n - 1, left, right);
  }

  private _update(node: number, start: number, end: number, idx: number, val: boolean) {
    if (start === end) {
      this.tree[node] = val;
      return;
    }
    const mid = Math.floor((start + end) / 2);
    if (idx <= mid) this._update(node * 2, start, mid, idx, val);
    else this._update(node * 2 + 1, mid + 1, end, idx, val);
    this.tree[node] = this.tree[node * 2] || this.tree[node * 2 + 1];
  }

  private _query(node: number, start: number, end: number, l: number, r: number): boolean {
    if (r < start || end < l) return false;
    if (l <= start && end <= r) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return this._query(node * 2, start, mid, l, r) || this._query(node * 2 + 1, mid + 1, end, l, r);
  }
}
