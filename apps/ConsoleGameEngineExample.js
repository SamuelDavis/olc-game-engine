import { CanvasGameEngine } from "../olc.js";
export default class ConsoleGameEngineExample extends CanvasGameEngine {
    constructor(width, height, pixelWidth, pixelHeight) {
        super();
    }
    onUserCreate() {
        return true;
    }
    onUserRender() {
        return true;
    }
    onUserUpdate(elapsedTime) {
        return true;
    }
}
