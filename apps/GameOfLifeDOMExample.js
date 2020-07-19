import { BrowserGameEngine, Color } from "../olc.js";
const CELLS_TO_A_SIDE = 15;
class Cell {
    constructor(alive = false) {
        this.alive = alive;
        this.el = document.createElement("div");
        this.el.style.display = "inline-block";
        this.el.style.verticalAlign = "top";
        this.el.style.border = `1px solid ${Color.BLACK}`;
        this.el.style.width = `calc(${100 / CELLS_TO_A_SIDE}vw - 2px)`;
        this.el.style.height = `calc(${100 / CELLS_TO_A_SIDE}vh - 2px)`;
    }
}
export default class GameOfLifeDOMExample extends BrowserGameEngine {
    constructor() {
        super(...arguments);
        this.paused = false;
        this.read = (i) => { var _a; return (_a = this.cells[i]) === null || _a === void 0 ? void 0 : _a.alive; };
        this.write = (i, alive) => this.changeSet[i] === undefined ? false : (this.changeSet[i] = alive);
        this.countNeighbors = (i) => [
            i - CELLS_TO_A_SIDE - 1,
            i - CELLS_TO_A_SIDE,
            i - CELLS_TO_A_SIDE + 1,
            i - 1,
            i + 1,
            i + CELLS_TO_A_SIDE - 1,
            i + CELLS_TO_A_SIDE,
            i + CELLS_TO_A_SIDE + 1,
        ]
            .map(this.read)
            .filter(Boolean).length;
    }
    create() {
        this.maxUPS = 2;
        this.cells = new Array(Math.pow(CELLS_TO_A_SIDE, 2))
            .fill(undefined)
            .map(() => {
            const cell = new Cell(Math.random() < 0.5);
            cell.el.addEventListener("mousedown", () => {
                if (this.paused)
                    cell.alive = !cell.alive;
            });
            return cell;
        });
        this.changeSet = this.cells.map((cell) => cell.alive);
        this.container.addEventListener("dblclick", () => (this.paused = !this.paused));
        return true;
    }
    initialRender() {
        this.cells.forEach((cell) => this.container.appendChild(cell.el));
        return true;
    }
    render() {
        document.title = `${GameOfLifeDOMExample.APP_NAME} - FPS: ${this.fps.toFixed(2)}`;
        this.cells.forEach((cell) => {
            cell.el.style.backgroundColor = (cell.alive ? Color.GREEN : Color.RED)
                .withAlpha(this.paused ? 0.5 : 1)
                .toString();
        });
        return true;
    }
    update() {
        if (this.paused)
            return true;
        this.cells.forEach((cell, i) => {
            const neighborCount = this.countNeighbors(i);
            if (cell.alive)
                this.write(i, neighborCount === 2 || neighborCount === 3);
            else
                this.write(i, neighborCount === 3);
        });
        this.cells.forEach((cell, i) => (cell.alive = this.changeSet[i]));
        return true;
    }
}
GameOfLifeDOMExample.APP_NAME = "Game of Life";
