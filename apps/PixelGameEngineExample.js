import { CanvasGameEngine, Pixel } from "../olc.js";
export default class PixelGameEngineExample extends CanvasGameEngine {
    constructor() {
        super(256, 240, 4, 4);
        this.rgbValues = [];
    }
    onUserCreate() {
        super.onUserCreate();
        this.rgbValues = new Array(this.getScreenWidth())
            .fill(undefined)
            .map(() => new Array(this.getScreenHeight()).fill([0, 0, 0]));
        return true;
    }
    onUserRender() {
        this.rgbValues.forEach((row, x) => row.forEach(([r, g, b], y) => this.Draw(x, y, new Pixel(r, g, b))));
        window.document.title = `${this.fps.toFixed(2)} fps`;
        return true;
    }
    onUserUpdate(elapsedTime) {
        this.rgbValues = this.rgbValues.map((row) => row.map(() => [
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
        ]));
        return true;
    }
}
