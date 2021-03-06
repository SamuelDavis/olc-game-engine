import { BrowserGameEngine, Color } from "../olc.js";

export default class NoiseCanvasExample extends BrowserGameEngine {
  public static APP_NAME = "Noise";

  private readonly screenWidth: number;
  private readonly screenHeight: number;
  private canvas: HTMLCanvasElement;
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
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("bitmaprenderer");
    this.canvas.width = this.screenWidth * pixelWidth;
    this.canvas.height = this.screenHeight * pixelHeight;
    this.offscreenCtx = new OffscreenCanvas(
      this.canvas.width,
      this.canvas.height
    ).getContext("2d");
    this.offscreenCtx.scale(pixelWidth, pixelHeight);
  }

  protected initialRender(): boolean {
    this.container.appendChild(this.canvas);
    this.container.style.display = "flex";
    this.container.style.justifyContent = "center";
    this.container.style.alignItems = "center";

    return true;
  }

  protected create(): boolean {
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

  protected render(): boolean {
    document.title = `${NoiseCanvasExample.APP_NAME} - FPS: ${this.fps.toFixed(
      2
    )}`;

    this.offscreenCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    for (const color in this.colorPools) {
      this.offscreenCtx.fillStyle = color;
      this.colorPools[color].forEach(([x, y]) =>
        this.offscreenCtx.fillRect(x, y, 1, 1)
      );
    }

    this.ctx.transferFromImageBitmap(
      this.offscreenCtx.canvas.transferToImageBitmap()
    );

    return true;
  }

  protected update(): boolean {
    for (const color in this.colorPools) this.colorPools[color].length = 0;

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
