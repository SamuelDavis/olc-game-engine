import { BrowserGameEngine, Color } from "../olc.js";

export default class NoiseCanvasExample extends BrowserGameEngine {
  private readonly screenWidth: number;
  private readonly screenHeight: number;
  private ctx: ImageBitmapRenderingContext;
  private offscreenCtx: OffscreenCanvasRenderingContext2D;
  private colors: string[];
  private colorPools: { [key: string]: [number, number][] };

  constructor(
    screenWidth = 160,
    screenHeight = 90,
    pixelWidth = 4,
    pixelHeight = 4
  ) {
    super();
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.ctx = document.createElement("canvas").getContext("bitmaprenderer");
    this.ctx.canvas.width = this.screenWidth * pixelWidth;
    this.ctx.canvas.height = this.screenHeight * pixelHeight;
    this.offscreenCtx = new OffscreenCanvas(
      this.ctx.canvas.width,
      this.ctx.canvas.height
    ).getContext("2d");
    this.offscreenCtx.scale(pixelWidth, pixelHeight);
  }

  protected onUserCreate(): boolean {
    document.body.appendChild(<HTMLCanvasElement>this.ctx.canvas);
    this.colors = [
      Color.RED.toString(),
      Color.GREEN.toString(),
      Color.BLUE.toString(),
    ];
    this.colorPools = this.colors.reduce(
      (pool, color) => ({ ...pool, [color]: [] }),
      {}
    );

    return true;
  }

  protected onUserRender(): boolean {
    this.offscreenCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    for (const color in this.colorPools) {
      this.offscreenCtx.fillStyle = color;
      this.colorPools[color].forEach(([x, y]) =>
        this.offscreenCtx.fillRect(x, y, 1, 1)
      );
    }

    document.title = `FPS: ${this.fps.toFixed(2)}`;

    this.ctx.transferFromImageBitmap(
      this.offscreenCtx.canvas.transferToImageBitmap()
    );

    return true;
  }

  protected onUserUpdate(elapsedTime: DOMHighResTimeStamp): boolean {
    for (const color in this.colorPools) this.colorPools[color] = [];

    for (let x = 0; x < this.screenWidth; x++) {
      for (let y = 0; y < this.screenHeight; y++) {
        const color = this.colors[
          Math.floor(Math.random() * this.colors.length)
        ];
        this.colorPools[color].push([x, y]);
      }
    }

    return true;
  }
}
