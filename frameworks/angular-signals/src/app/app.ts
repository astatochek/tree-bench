import { Component } from '@angular/core';
import { TreeNode } from './model'
import { TreeNodeComponent } from './tree-node'

@Component({
  selector: 'app-root',
  template: `
    <tree-node [node]="tree" />
  `,
  imports: [
    TreeNodeComponent,
  ],
})
export class App {
  readonly tree = TreeNode.fromRaw(
    {
      title: 'Root Node 1',
      children: [
        {
          title: 'Child 1.1',
          children: [
            {
              title: 'Grandchild 1.1.1',
              children: []
            }
          ]
        },
        {
          title: 'Child 1.2',
          children: []
        }
      ]
    },
    )
}
