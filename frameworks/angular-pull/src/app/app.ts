import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  template: `
    <h1>Welcome to {{ title() }}!</h1>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal("angular-pull");
}
