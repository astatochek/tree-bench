import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { Nil, RawTreeNode } from "./model";

export const tree: { json: RawTreeNode | Nil } = { json: null };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() =>
      fetch(`${window.location.origin}/api/tree`)
        .then((res) => res.json())
        .then((json) => {
          tree.json = json;
        }),
    ),
  ],
};
