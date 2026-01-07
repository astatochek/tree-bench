import type { CDPSession, Page } from "playwright";

export interface TraceEvent {
  name: string;
  cat: string;
  ph: "B" | "E" | "X" | "I" | "b" | "e" | "n" | "s" | "t" | "f" | "P" | "N" | "O" | "D";
  ts: number; // microseconds
  dur?: number;
  pid: number;
  tid: number;
  args?: {
    data?: {
      type?: string;
    };
  };
}

export interface TimelineResult {
  durationMillis: number; // milliseconds
  clickStart: number;
  commitEnd: number;
  eventsProcessed: number;
  timestamp: Date;
}

export class TimelineHarness {
  private cdpSession: CDPSession | null = null;
  private traceDataBuffer: any[] = [];
  private isTracing = false;

  constructor(private page: Page) {}

  /**
   * Start Chrome DevTools Protocol tracing for performance events
   */
  async startCDPTracing(): Promise<void> {
    if (!this.cdpSession) {
      // Get CDP session from any page
      this.cdpSession = await this.page.context().newCDPSession(this.page);
    }

    // Start tracing with performance categories
    await this.cdpSession.send("Tracing.start", {
      categories: [
        "-*", // Disable all default categories first

        // Enable specific performance categories
        "devtools.timeline",
        "disabled-by-default-devtools.timeline",
        "disabled-by-default-devtools.timeline.frame",
        "disabled-by-default-devtools.timeline.stack",
        "toplevel",
        "benchmark",
        "v8.execute",
        "blink.user_timing",
        "latencyInfo",
        "cc",
        "gpu",
        "input",

        // Paint/rendering categories
        "disabled-by-default-devtools.timeline.layers",
        "disabled-by-default-devtools.timeline.picture",
        "disabled-by-default-layout_shift.debug",
        "blink.invalidation",
        "blink.style",

        // Memory/GC
        "disabled-by-default-devtools.timeline.memory",
        "v8",
      ].join(","),
      options: "record-until-full",
      bufferUsageReportingInterval: 1000,
    });

    this.isTracing = true;
    this.traceDataBuffer = [];

    // Listen for trace data chunks
    this.cdpSession.on("Tracing.dataCollected", (event) => {
      this.traceDataBuffer.push(...event.value);
    });
  }

  /**
   * Stop CDP tracing and collect all events
   */
  async stopCDPTracing(): Promise<TraceEvent[]> {
    if (!this.cdpSession || !this.isTracing) {
      throw new Error("CDP tracing not started");
    }

    // Collect remaining data
    const traceComplete = new Promise<TraceEvent[]>((resolve) => {
      this.cdpSession!.once("Tracing.tracingComplete", () => {
        resolve(this.processTraceBuffer());
      });
    });

    // Stop tracing
    await this.cdpSession.send("Tracing.end");

    const events = await traceComplete;
    this.isTracing = false;

    return events;
  }

  /**
   * Process the raw trace buffer
   */
  private processTraceBuffer(): TraceEvent[] {
    // Filter and parse trace events
    const events: TraceEvent[] = [];

    for (const item of this.traceDataBuffer) {
      if (item && typeof item === "object") {
        events.push({
          name: item.name || "",
          cat: item.cat || "",
          ph: item.ph || "X",
          ts: item.ts || 0,
          dur: item.dur,
          pid: item.pid || 1,
          tid: item.tid || 1,
          args: item.args || {},
        });
      }
    }

    return events;
  }

  /**
   * Main measurement method using CDP tracing
   */
  async measureInputToPaint(interaction: () => Promise<void>): Promise<TimelineResult> {
    // Start CDP tracing for performance events
    await this.startCDPTracing();

    // Small delay to ensure tracing is ready
    await this.page.waitForTimeout(10);

    // Execute the interaction
    await interaction();

    // Wait for rendering to complete
    await this.page.waitForTimeout(10);

    // Stop tracing and get performance events
    const events = await this.stopCDPTracing();

    //await Bun.write(Bun.file(`logs-${Date.now()}.json`), JSON.stringify(events));

    // Analyze the performance timeline
    const result = this.analyzePerformanceEvents(events);

    return {
      ...result,
      timestamp: new Date(),
    };
  }

  /**
   * Analyze Chrome performance timeline events
   */
  private analyzePerformanceEvents(
    events: TraceEvent[],
  ): Pick<TimelineResult, "durationMillis" | "clickStart" | "commitEnd" | "eventsProcessed"> {
    // Find input/click events
    const inputEvents = this.findInputEvents(events);

    if (inputEvents.length === 0) {
      throw new Error(`No input events found in performance timeline`);
    }

    // Use the first input event as trigger
    const triggerEvent = inputEvents[0]!;
    const triggerStartTime = triggerEvent.ts;

    // Get events after trigger
    const postTriggerEvents = events.filter((e) => e.ts >= triggerStartTime);

    // Find commit/paint events
    const commitEvents = this.findCommitEvents(postTriggerEvents);

    const relevantCommit = this.findFirstCommitEventAfterTrigger(
      commitEvents,
      triggerStartTime,
      triggerEvent.pid,
    );

    if (!relevantCommit) {
      throw new Error("No commit event found");
    }

    const durationMs = (relevantCommit.ts - triggerStartTime) / 1000;

    return {
      durationMillis: durationMs,
      clickStart: triggerStartTime,
      commitEnd: relevantCommit.ts,
      eventsProcessed: postTriggerEvents.length,
    };
  }

  private findFirstCommitEventAfterTrigger(
    commitEvents: TraceEvent[],
    triggerStartTime: number,
    pid: number,
  ): TraceEvent | null | undefined {
    const commitsAfterTrigger = commitEvents.filter(
      (c) => c.ts > triggerStartTime && c.pid === pid,
    );

    if (commitsAfterTrigger.length > 0) {
      return commitsAfterTrigger[0];
    }

    return null;
  }

  /**
   * Find input events in performance timeline
   */
  private findInputEvents(events: TraceEvent[]): TraceEvent[] {
    return events.filter((e) => {
      const isInputEvent = e.args?.data?.type === "input";

      // Only include B (begin) or X (complete) events
      return isInputEvent && (e.ph === "B" || e.ph === "X");
    });
  }

  /**
   * Find commit events
   */
  private findCommitEvents(events: TraceEvent[]): TraceEvent[] {
    return events.filter((e) => {
      return e.name === "Commit" && e.ph === "X";
    });
  }
}
