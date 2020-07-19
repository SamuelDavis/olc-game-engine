export class Color {
  private readonly r: number;
  private readonly g: number;
  private readonly b: number;
  private readonly a: number;

  constructor(r = 0, g = 0, b = 0, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static get WHITE(): Color {
    return new Color(255, 255, 255);
  }

  static get BLACK(): Color {
    return new Color(0, 0, 0, 255);
  }

  static get RED(): Color {
    return new Color(255, 0, 0, 255);
  }

  static get GREEN(): Color {
    return new Color(0, 255, 0, 255);
  }

  static get BLUE(): Color {
    return new Color(0, 0, 255, 255);
  }

  public withAlpha(value: number): Color {
    return new Color(this.r, this.g, this.b, value);
  }

  toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }
}

export abstract class BrowserGameEngine {
  public static APP_NAME = "Browser App";
  public readonly container: HTMLDivElement = document.createElement("div");
  private readonly maxUpdates = 240;
  private minRenderDelay: number;
  private minUpdateDelay: number;
  private nextAnimationFrame: number;
  private lastFPSAverageTimestamp: DOMHighResTimeStamp = 0;
  private elapsedTime: DOMHighResTimeStamp = 0;
  private weightedFPSAverage = 0;
  private framesThisIteration = 0;
  private fpsAverageWeight = 0.25;
  private started = false;

  constructor(maxUPS = 60, maxFPS = 60) {
    this.maxUPS = maxUPS;
    this.maxFPS = maxFPS;
  }

  private _maxFPS: number;

  protected set maxFPS(value: number) {
    this._maxFPS = value;
    this.minRenderDelay = 1000 / this._maxFPS;
  }

  private _maxUPS: number;

  protected set maxUPS(value: number) {
    this._maxUPS = value;
    this.minUpdateDelay = 1000 / this._maxUPS;
  }

  protected get fps(): number {
    return this.weightedFPSAverage;
  }

  public start(): void {
    // start main loop
    if (!this.started && this.create())
      this.nextAnimationFrame = requestAnimationFrame(
        (timestamp: DOMHighResTimeStamp) => {
          if (this.initialRender()) this.renderFrom(timestamp);
        }
      );

    this.started = true;
  }

  public stop(): void {
    if (this.started && this.destroy()) {
      cancelAnimationFrame(this.nextAnimationFrame);
      this.elapsedTime = 0;
      this.weightedFPSAverage = 0;
      this.framesThisIteration = 0;
      this.started = false;
    }
  }

  protected abstract create(): boolean;

  protected abstract render(): boolean;

  protected abstract update(elapsedTime: DOMHighResTimeStamp): boolean;

  protected panic(): boolean {
    this.elapsedTime = 0;

    return true;
  }

  protected initialRender(): boolean {
    return true;
  }

  protected destroy(): boolean {
    return true;
  }

  private renderFrom(timestamp: DOMHighResTimeStamp): void {
    this.nextAnimationFrame = requestAnimationFrame(
      this.renderLoop.bind(this, timestamp)
    );
  }

  private renderLoop(
    lastTimestamp: DOMHighResTimeStamp,
    currentTimestamp: DOMHighResTimeStamp
  ): void {
    this.elapsedTime += currentTimestamp - lastTimestamp;

    // skip render if rendering too fast
    if (this.elapsedTime < this.minRenderDelay)
      return this.renderFrom(lastTimestamp);

    // track average fps
    if (currentTimestamp > this.lastFPSAverageTimestamp + 1000)
      this.updateFPSWeightedAverage(currentTimestamp);

    // update with a constant delta
    // until all the time between frames is used up
    let numUpdates = 0;
    while (
      this.elapsedTime > this.minUpdateDelay &&
      this.update(this.minUpdateDelay)
    ) {
      this.elapsedTime -= this.minUpdateDelay;
      if (++numUpdates >= this.maxUpdates && this.panic()) break;
    }

    // render & continue loop
    this.framesThisIteration++;
    if (this.render()) this.renderFrom(currentTimestamp);
  }

  private updateFPSWeightedAverage(currentTimestamp: DOMHighResTimeStamp) {
    const msSinceLastIteration =
      currentTimestamp - this.lastFPSAverageTimestamp;
    const weightedFPSThisIteration =
      this.fpsAverageWeight * this.framesThisIteration;
    const reweightedFPSLastIteration =
      (1 - this.fpsAverageWeight) * this.weightedFPSAverage;

    this.weightedFPSAverage =
      (weightedFPSThisIteration * 1000) / msSinceLastIteration +
      reweightedFPSLastIteration;

    this.framesThisIteration = 0;
    this.lastFPSAverageTimestamp = currentTimestamp;
  }
}
