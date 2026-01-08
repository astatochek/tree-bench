export class TreeNode {
  private $isExpanded = $state(false);
  get isExpanded() {
    return this.$isExpanded;
  }
  private readonly $isSelfEdited: boolean;
  private readonly $isEditedRecursive: boolean;

  readonly $isEdited: boolean;
  get isEdited() {
    return this.$isEdited;
  }

  constructor(
    readonly title: string,
    readonly children: TreeNode[],
    readonly attributes: TreeNodeAttr[],
  ) {
    this.$isSelfEdited = $derived(this.attributes.some((attr) => attr.isEdited));
    this.$isEditedRecursive = $derived(
      this.$isSelfEdited || this.children.some((c) => c.$isEditedRecursive),
    );
    this.$isEdited = $derived(this.$isExpanded ? this.$isSelfEdited : this.$isEditedRecursive);
  }

  toggle(): void {
    this.$isExpanded = !this.$isExpanded;
  }

  static fromRaw(node: RawTreeNode): TreeNode {
    return new TreeNode(
      node.title,
      node.children?.map(TreeNode.fromRaw) ?? [],
      node.attributes?.map(TreeNodeAttr.fromRaw) ?? [],
    );
  }
}

export class TreeNodeAttr {
  private $isEdited = $state(false);
  get isEdited() {
    return this.$isEdited;
  }

  private $value: string;

  get value(): string {
    return this.$value;
  }

  set value(value: string) {
    this.$value = value;
    this.$isEdited = true;
  }

  constructor(
    readonly title: string,
    value: string,
  ) {
    this.$value = $state(value);
  }

  static fromRaw(attr: RawTreeNodeAttr): TreeNodeAttr {
    return new TreeNodeAttr(attr.title, attr.value);
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
