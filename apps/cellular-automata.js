var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CanvasGameEngine, { COLOR, PIXEL_TYPE } from "../olc.js";
export default class CellularAutomata extends CanvasGameEngine {
    constructor() {
        super(...arguments);
        this.paused = false;
    }
    onUserCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.targetFPS = 12;
            this.screenLength = this.screenWidth * this.screenHeight;
            this.m_state = new Array(this.screenLength)
                .fill(0)
                .map(() => Math.random() < 0.5);
            window.addEventListener("keydown", (key) => {
                if (key.key === " ")
                    this.paused = true;
            });
            window.addEventListener("keyup", (key) => {
                if (key.key === " ")
                    this.paused = false;
            });
            return true;
        });
    }
    read(x, y) {
        return this.m_output[y * this.screenWidth + x] || false;
    }
    write(x, y, value) {
        this.m_state[y * this.screenWidth + x] = value;
    }
    onUserUpdate(elapsedTime) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.paused)
                return Promise.resolve(true);
            this.m_output = Array.from(this.m_state);
            this.bufferCtx.fillStyle = `rgb(${COLOR.BLACK})`;
            this.bufferCtx.fillRect(0, 0, this.screenWidth, this.screenHeight);
            this.bufferCtx.fillStyle = `rgba(${COLOR.WHITE},${PIXEL_TYPE.PIXEL_SOLID})`;
            for (let x = 0; x < this.screenWidth; x++) {
                for (let y = 0; y < this.screenHeight; y++) {
                    const neighbors = this.countNeighbors(x, y);
                    if (this.read(x, y)) {
                        this.write(x, y, neighbors == 2 || neighbors == 3);
                    }
                    else {
                        this.write(x, y, neighbors === 3);
                    }
                    if (this.read(x, y))
                        this.bufferCtx.fillRect(x, y, 1, 1);
                }
            }
            return new Promise((resolve) => setTimeout(resolve.bind(null, true), this.calculateTimeout(elapsedTime)));
        });
    }
    calculateTimeout(elapsedTime) {
        const timeout = 1000 / this.targetFPS;
        return timeout - Math.max(0, elapsedTime - timeout);
    }
    countNeighbors(x, y) {
        let total = 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i === x && j === y)
                    continue;
                if (this.read(i, j))
                    total++;
            }
        }
        return total;
    }
}
