import { Accessor, createMemo, createSignal, Setter } from "solid-js";

export class TreeNode {
  readonly isExpanded: Accessor<boolean>;
  readonly isSelfEdited: Accessor<boolean>;
  readonly isEditedRecursive: Accessor<boolean>;
  readonly isEdited: Accessor<boolean>;

  private readonly setIsExpanded: Setter<boolean>;

  constructor(
    readonly title: string,
    readonly children: TreeNode[],
    readonly attributes: TreeNodeAttr[],
  ) {
    const [isExpanded, setIsExpanded] = createSignal(false);
    this.isExpanded = isExpanded;
    this.setIsExpanded = setIsExpanded;
    this.isSelfEdited = createMemo(() => this.attributes.some((attr) => attr.isEdited()));
    this.isEditedRecursive = createMemo(() =>
      this.children.some((c) => c.isSelfEdited() || c.isEditedRecursive()),
    );
    this.isEdited = createMemo(() =>
      this.isExpanded() ? this.isSelfEdited() : this.isSelfEdited() || this.isEditedRecursive(),
    );
  }

  toggle(): void {
    this.setIsExpanded((prev) => !prev);
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
  readonly isEdited: Accessor<boolean>;
  private readonly setIsEdited: Setter<boolean>;

  readonly value: Accessor<string>;
  private readonly setValue: Setter<string>;

  constructor(
    readonly title: string,
    initialValue: string,
  ) {
    const [isEdited, setIsEdited] = createSignal(false);
    this.isEdited = isEdited;
    this.setIsEdited = setIsEdited;
    const [value, setValue] = createSignal(initialValue);
    this.value = value;
    this.setValue = setValue;
  }

  update(value: string): void {
    this.setValue(value);
    this.setIsEdited(true);
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
