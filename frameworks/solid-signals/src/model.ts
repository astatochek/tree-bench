import { Accessor, createMemo, createSignal, Setter, Signal } from "solid-js";

type UnwrappedSignal<T> = Readonly<{ get: Accessor<T>; set: Setter<T> }>;

function unwrap<T>(signal: Signal<T>): UnwrappedSignal<T> {
  const [get, set] = signal;
  return { get, set };
}

export class TreeNode {
  readonly isExpanded = unwrap(createSignal(false));
  readonly isSelfEdited: Accessor<boolean>;
  readonly isEditedRecursive : Accessor<boolean>;
  readonly isEdited : Accessor<boolean>;

  constructor(
    readonly title: string,
    readonly children: TreeNode[],
    readonly attributes: TreeNodeAttr[],
  ) {
      this.isSelfEdited = createMemo(() => this.attributes.some((attr) => attr.isEdited.get()));
      this.isEditedRecursive = createMemo(() => this.isSelfEdited() || this.isSomeChildEdited());
      this.isEdited = createMemo(() =>
          this.isExpanded.get() ? this.isSelfEdited() : this.isEditedRecursive(),
      );
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
}

export class TreeNodeAttr {
  readonly isEdited = unwrap(createSignal(false));

  private readonly valueInternal: UnwrappedSignal<string>;

  get value(): string {
    return this.valueInternal.get();
  }

  set value(value: string) {
    this.valueInternal.set(value);
    this.isEdited.set(true);
  }

  constructor(
    readonly title: string,
    value: string,
  ) {
    this.valueInternal = unwrap(createSignal(value));
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
