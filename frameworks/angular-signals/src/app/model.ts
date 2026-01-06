import { computed, signal, WritableSignal } from "@angular/core";

export class TreeNode {
  readonly isExpanded = signal(false);
  readonly isSelfEdited = computed(() => this.attributes.some((attr) => attr.isEdited()));
  readonly isEditedRecursive = computed(() => this.isSelfEdited() || this.isSomeChildEdited());
  readonly isEdited = computed(() =>
    this.isExpanded() ? this.isSelfEdited() : this.isEditedRecursive(),
  );

  constructor(
    readonly title: string,
    readonly children: TreeNode[],
    readonly attributes: TreeNodeAttr[],
  ) {}

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
}

export class TreeNodeAttr {
  readonly isEdited = signal(false);

  private readonly valueInternal: WritableSignal<string>;

  get value(): string {
    return this.valueInternal();
  }

  set value(value: string) {
    this.valueInternal.set(value);
    this.isEdited.set(true);
  }

  constructor(
    readonly title: string,
    value: string,
  ) {
    this.valueInternal = signal(value);
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
