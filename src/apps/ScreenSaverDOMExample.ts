import { BrowserGameEngine, Color } from "../olc.js";

class Subject {
  public readonly el: HTMLDivElement;
  public readonly size: number;
  public x: number;
  public y: number;
  public dx: number;
  public dy: number;

  constructor(size, x: number, y: number) {
    this.el = document.createElement("div");
    this.size = size;
    this.el.style.position = "absolute";
    this.el.style.backgroundColor = Color.RED.toString();
    this.el.style.height = `${this.size}px`;
    this.el.style.width = `${this.size}px`;

    this.x = x;
    this.y = y;
    this.dx = 0.075;
    this.dy = 0.075;
  }
}

export default class ScreenSaverDOMExample extends BrowserGameEngine {
  public static APP_NAME = "Screen Saver";

  private subject: Subject;

  private get topBound(): number {
    return this.container.offsetTop;
  }

  private get rightBound(): number {
    return (
      this.container.offsetLeft + this.container.offsetWidth - this.subject.size
    );
  }

  private get bottomBound(): number {
    return (
      this.container.offsetTop + this.container.offsetHeight - this.subject.size
    );
  }

  private get leftBound(): number {
    return this.container.offsetLeft;
  }

  protected create(): boolean {
    const size = 50;
    this.subject = new Subject(
      size,
      Math.floor(Math.random() * (window.innerWidth - size)),
      Math.floor(Math.random() * (window.innerHeight - size))
    );

    return true;
  }

  protected initialRender(): boolean {
    this.subject.el.style.textAlign = "center";
    this.container.appendChild(this.subject.el);

    return true;
  }

  protected render(): boolean {
    document.title = `${
      ScreenSaverDOMExample.APP_NAME
    } - FPS: ${this.fps.toFixed(2)}`;

    this.subject.el.style.left = `${this.subject.x}px`;
    this.subject.el.style.top = `${this.subject.y}px`;

    return true;
  }

  protected update(elapsedTime: DOMHighResTimeStamp): boolean {
    this.subject.x += this.subject.dx * elapsedTime;
    this.subject.y += this.subject.dy * elapsedTime;

    if (this.subject.x < this.leftBound)
      this.subject.dx = Math.abs(this.subject.dx);
    if (this.subject.x > this.rightBound)
      this.subject.dx = -Math.abs(this.subject.dx);

    if (this.subject.y < this.topBound)
      this.subject.dy = Math.abs(this.subject.dy);
    if (this.subject.y > this.bottomBound)
      this.subject.dy = -Math.abs(this.subject.dy);

    return true;
  }
}
