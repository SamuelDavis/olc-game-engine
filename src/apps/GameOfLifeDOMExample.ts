import { BrowserGameEngine, Color } from "../olc.js";

const CELLS_TO_A_SIDE = 15;

class Cell {
  public alive: boolean;
  public readonly el: HTMLDivElement;

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
  public static APP_NAME = "Game of Life";

  private cells: Cell[];
  private changeSet: boolean[];
  private paused = false;

  protected create(): boolean {
    this.maxUPS = 2;
    this.cells = new Array(Math.pow(CELLS_TO_A_SIDE, 2))
      .fill(undefined)
      .map(() => {
        const cell = new Cell(Math.random() < 0.5);
        cell.el.addEventListener("mousedown", () => {
          if (this.paused) cell.alive = !cell.alive;
        });
        return cell;
      });
    this.changeSet = this.cells.map((cell) => cell.alive);

    this.container.addEventListener(
      "dblclick",
      () => (this.paused = !this.paused)
    );

    return true;
  }

  protected initialRender(): boolean {
    this.cells.forEach((cell) => this.container.appendChild(cell.el));

    return true;
  }

  protected render(): boolean {
    document.title = `${
      GameOfLifeDOMExample.APP_NAME
    } - FPS: ${this.fps.toFixed(2)}`;

    this.cells.forEach((cell) => {
      cell.el.style.backgroundColor = (cell.alive ? Color.GREEN : Color.RED)
        .withAlpha(this.paused ? 0.5 : 1)
        .toString();
    });

    return true;
  }

  protected update(): boolean {
    if (this.paused) return true;

    this.cells.forEach((cell, i) => {
      const neighborCount = this.countNeighbors(i);

      if (cell.alive) this.write(i, neighborCount === 2 || neighborCount === 3);
      else this.write(i, neighborCount === 3);
    });

    this.cells.forEach((cell, i) => (cell.alive = this.changeSet[i]));

    return true;
  }

  private read = (i: number): boolean => this.cells[i]?.alive;

  private write = (i: number, alive: boolean) =>
    this.changeSet[i] === undefined ? false : (this.changeSet[i] = alive);

  private countNeighbors = (i: number): number =>
    [
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
