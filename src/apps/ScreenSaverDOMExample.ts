import { BrowserGameEngine, COLOR } from "../olc.js";

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
    this.el.style.backgroundColor = COLOR.RED;
    this.el.style.height = `${this.size}px`;
    this.el.style.width = `${this.size}px`;

    this.x = x;
    this.y = y;
    this.dx = 0.075;
    this.dy = 0.075;
  }
}

export default class ScreenSaverDOMExample extends BrowserGameEngine {
  private subject: Subject;

  protected onUserCreate(): boolean {
    const size = 50;
    this.subject = new Subject(
      size,
      Math.floor(Math.random() * (window.innerWidth - size)),
      Math.floor(Math.random() * (window.innerHeight - size))
    );

    return true;
  }

  protected onUserRender(): boolean {
    if (this.subject.el.parentElement !== document.body) {
      this.subject.el.style.textAlign = "center";
      document.body.style.width = "100vw";
      document.body.style.height = "100vh";
      document.body.appendChild(this.subject.el);
    }
    this.subject.el.style.left = `${this.subject.x}px`;
    this.subject.el.style.top = `${this.subject.y}px`;

    return true;
  }

  protected onUserUpdate(elapsedTime: DOMHighResTimeStamp): boolean {
    this.subject.x += this.subject.dx * elapsedTime;
    this.subject.y += this.subject.dy * elapsedTime;

    if (this.subject.x < 0) this.subject.dx = Math.abs(this.subject.dx);
    if (this.subject.x > window.innerWidth - this.subject.size)
      this.subject.dx = -Math.abs(this.subject.dx);

    if (this.subject.y < 0) this.subject.dy = Math.abs(this.subject.dy);
    if (this.subject.y > window.innerHeight - this.subject.size)
      this.subject.dy = -Math.abs(this.subject.dy);

    this.subject.el.innerText = `${this.fps.toFixed(2)} FPS`;

    return true;
  }
}
