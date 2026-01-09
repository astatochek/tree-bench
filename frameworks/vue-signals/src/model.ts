import { computed, type ComputedRef, type Ref, ref } from "vue";

export class TreeNodeAttribute {
  readonly isEdited = ref(false);
  private readonly valueInternal: Ref<string, string>;

  get value() {
    return this.valueInternal.value;
  }

  set value(v: string) {
    this.valueInternal.value = v;
    this.isEdited.value = true;
  }

  constructor(
    readonly title: string,
    value: string,
  ) {
    this.valueInternal = ref(value);
  }
}

export type Nil = null | undefined;

export class TreeNode {
  readonly isExpanded = ref(false);
  readonly isEdited = computed(() =>
    this.isExpanded.value
      ? this.isOwnEdited.value
      : this.isOwnEdited.value || this.isEditedDescendant.value,
  );
  private readonly isOwnEdited = computed(() =>
    this.attributes.some((attr) => attr.isEdited.value),
  );
  private readonly isEditedDescendant: ComputedRef<boolean> = computed(() =>
    this.children.some((n) => n.isOwnEdited.value || n.isEditedDescendant.value),
  );

  constructor(
    readonly title: string,
    readonly attributes: TreeNodeAttribute[],
    readonly children: TreeNode[],
  ) {}
}

export type RawTreeNode = {
  title: string;
  children?: RawTreeNode[];
  attributes?: { title: string; value: string }[];
};

export function parse(raw: RawTreeNode): TreeNode {
  return new TreeNode(
    raw.title,
    raw.attributes?.map((attr) => new TreeNodeAttribute(attr.title, attr.value)) ?? [],
    raw.children?.map(parse) ?? [],
  );
}
