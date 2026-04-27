import type { Page } from "playwright";

export class MemoryHarness {
  private readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async forceGC() {
    await this.page.evaluate("window.gc({type:'major',execution:'sync',flavor:'last-resort'})");
  }

  async measure() {
    const mb =
      ((await this.page.evaluate("performance.measureUserAgentSpecificMemory()")) as any).bytes /
      1024 /
      1024;
    return { mb };
  }
}
