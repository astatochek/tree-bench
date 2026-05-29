type OriginTreeNodeWithFeature<TValue, TFeatureKey extends string> = {
  readonly [key in TFeatureKey]: ReactiveTreeNodeFeature<TValue, TFeatureKey>;
} & {
  readonly [key in TFeatureKey as `recompute${key}`]: () => TValue;
} & {
  parent: OriginTreeNodeWithFeature<unknown, TFeatureKey> | Nil;
};

const None = Symbol("None");

class ReactiveTreeNodeFeature<TValue, TFeatureKey extends string> {
  private cached: TValue | typeof None = None;

  constructor(
    private readonly origin: OriginTreeNodeWithFeature<TValue, TFeatureKey>,
    private readonly key: TFeatureKey,
  ) {}

  getValue(): TValue {
    if (this.cached !== None) {
      return this.cached;
    }
    //@ts-ignore
    const value = (this.origin[`recompute${this.key}`] as () => TValue)();
    this.cached = value;
    return value;
  }

  invalidate(): void {
    this.cached = None;
    this.origin.parent?.[this.key]?.invalidate();
  }
}

export type DisplayedTreeNode = {
  title: string;
  hasChildren: boolean;
  children: DisplayedTreeNode[];
  isEdited: boolean;
  isExpanded: boolean;
  origin: TreeNode;
};

export class TreeNode implements OriginTreeNodeWithFeature<boolean, "isEditedRecursive"> {
  readonly isEditedRecursive: ReactiveTreeNodeFeature<boolean, "isEditedRecursive">;
  readonly id = genId();
  public isExpanded = false;

  constructor(
    public title: string,
    public children: TreeNode[],
    public attributes: TreeNodeAttr[],
    readonly parent: TreeNode | Nil,
  ) {
    this.isEditedRecursive = new ReactiveTreeNodeFeature(this, "isEditedRecursive");
  }

  recomputeisEditedRecursive(): boolean {
    return this.attributes.some(TreeNodeAttr.isEdited) || this.children.some(TreeNode.isEdited);
  }

  static fromRaw(raw: RawTreeNode, parent: TreeNode | Nil): TreeNode {
    const node = new TreeNode(raw.title, [], [], parent);
    node.children = raw.children?.map((c) => TreeNode.fromRaw(c, node)) ?? [];
    node.attributes = raw.attributes?.map((a) => TreeNodeAttr.fromRaw(a, node)) ?? [];
    return node;
  }

  static isEdited(node: TreeNode): boolean {
    return node.attributes.some(TreeNodeAttr.isEdited) || node.isEditedRecursive.getValue();
  }

  toDisplayed(): DisplayedTreeNode {
    return {
      title: this.title,
      hasChildren: this.children.length !== 0,
      isExpanded: this.isExpanded,
      isEdited: this.isExpanded
        ? this.attributes.some(TreeNodeAttr.isEdited)
        : this.isEditedRecursive.getValue(),
      children: this.isExpanded ? this.children.map((c) => c.toDisplayed()) : [],
      origin: this,
    };
  }

  attrsToDisplayed(): DisplayedTreeNodeAttr[] {
    return this.attributes.map((attr) => attr.toDisplayed());
  }
}

export class TreeNodeAttr implements OriginTreeNodeWithFeature<boolean, "isEditedRecursive"> {
  readonly isEditedRecursive: ReactiveTreeNodeFeature<boolean, "isEditedRecursive">;
  readonly id = genId();

  private valueInternal: string;

  constructor(
    readonly title: string,
    private readonly initialValue: string,
    readonly parent: TreeNode,
  ) {
    this.valueInternal = this.initialValue;
    this.isEditedRecursive = new ReactiveTreeNodeFeature(this, "isEditedRecursive");
  }

  recomputeisEditedRecursive(): boolean {
    return this.valueInternal !== this.initialValue;
  }

  setValue(value: string): void {
    this.valueInternal = value;
    this.isEditedRecursive.invalidate();
  }

  static fromRaw(attr: RawTreeNodeAttr, node: TreeNode): TreeNodeAttr {
    return new TreeNodeAttr(attr.title, attr.value, node);
  }

  static isEdited(attr: TreeNodeAttr): boolean {
    return attr.isEditedRecursive.getValue();
  }

  toDisplayed(): DisplayedTreeNodeAttr {
    return {
      title: this.title,
      isEdited: this.isEditedRecursive.getValue(),
      value: this.valueInternal,
      origin: this,
    };
  }
}

// --- Types & Support ---

export type DisplayedTreeNodeAttr = {
  title: string;
  isEdited: boolean;
  value: string;
  origin: TreeNodeAttr;
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
