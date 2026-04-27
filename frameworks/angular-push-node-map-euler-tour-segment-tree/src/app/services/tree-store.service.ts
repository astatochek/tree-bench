import { computed, Injectable, signal } from "@angular/core";
import { tree } from "../app.config";
import { Nil, Tree } from "../model";

@Injectable({ providedIn: "root" })
export class TreeStore {
  private readonly tree = signal<Tree>(Tree.fromDto(tree.json!), { equal: () => false });
  readonly flattened = computed(() => this.tree().flatten());

  readonly selectedId = signal<string | Nil>(void 0);
  readonly selectedTitle = computed(() => {
    const selected = this.selectedId();
    return selected ? this.tree().nodeTitle(selected) : [];
  });
  readonly attributes = computed(() => {
    const selected = this.selectedId();
    return selected ? this.tree().attributes(selected) : [];
  });

  constructor() {
    delete tree.json;
  }

  edit(nodeId: string, attrId: string, value: string): void {
    this.tree.update((t) => t.edit(nodeId, attrId, value));
  }

  toggle(nodeId: string): void {
    this.tree.update((t) => t.toggle(nodeId));
  }
}
