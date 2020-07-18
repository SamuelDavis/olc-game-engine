export enum COLOR {
  RED = "red",
  GREEN = "green",
  BLACK = "black",
}

export abstract class BrowserGameEngine {
  private readonly maxFPS: number;
  private readonly maxUPS: number;
  private readonly minRenderDelay: number;
  private readonly minUpdateDelay: number;
  private readonly maxUpdates = 240;
  private lastFPSTimestamp: DOMHighResTimeStamp = 0;
  private elapsedTime: DOMHighResTimeStamp = 0;
  private weightedFPSAverage = 0;
  private framesThisSecond = 0;
  private nextAnimationFrame: number;
  private started = false;

  constructor(maxUPS = 60, maxFPS = 60) {
    this.maxUPS = maxUPS;
    this.maxFPS = maxFPS;
    this.minUpdateDelay = 1000 / this.maxUPS;
    this.minRenderDelay = 1000 / this.maxFPS;
  }

  protected get fps() {
    return this.weightedFPSAverage;
  }

  public start(): void {
    if (this.started) return;

    // start main loop
    if (this.onUserCreate())
      this.nextAnimationFrame = requestAnimationFrame(
        this.mainLoop.bind(this, performance.now())
      );

    this.started = true;
  }

  protected abstract onUserCreate(): boolean;

  protected abstract onUserRender(): boolean;

  protected abstract onUserUpdate(elapsedTime: DOMHighResTimeStamp): boolean;

  protected panic(): void {
    this.elapsedTime = 0;
  }

  private mainLoop(
    lastTimestamp: DOMHighResTimeStamp,
    timestamp: DOMHighResTimeStamp
  ): void {
    this.elapsedTime += timestamp - lastTimestamp;

    // track average fps
    if (timestamp > this.lastFPSTimestamp + 1000) {
      this.weightedFPSAverage =
        0.25 * this.framesThisSecond + 0.75 * this.weightedFPSAverage;
      this.lastFPSTimestamp = timestamp;
      this.framesThisSecond = 0;
    }
    this.framesThisSecond++;

    // skip render if rendering too fast
    if (this.elapsedTime < this.minRenderDelay) {
      this.nextAnimationFrame = requestAnimationFrame(
        this.mainLoop.bind(this, lastTimestamp)
      );
      return;
    }

    // update at a constant speed
    // until all the time between frames is used up
    let numUpdates = 0;
    while (
      this.elapsedTime > this.minUpdateDelay &&
      this.onUserUpdate(this.minUpdateDelay)
    ) {
      this.elapsedTime -= this.minUpdateDelay;
      if (++numUpdates >= this.maxUpdates) {
        this.panic();
        break;
      }
    }

    // continue main loop
    if (this.onUserRender())
      this.nextAnimationFrame = requestAnimationFrame(
        this.mainLoop.bind(this, timestamp)
      );
  }
}
