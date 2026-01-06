import { Injectable, signal } from "@angular/core";
import { Nil, TreeNode } from "./model";

@Injectable({
  providedIn: "root",
})
export class SelectedNodeProvider {
  readonly selected = signal<TreeNode | Nil>(void 0);
}
