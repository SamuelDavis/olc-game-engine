import BrowserGameEngine, { COLOR } from "../olc.js";
class Subject {
    constructor(x = 0, y = 0, dx = 0, dy = 0, size = 50, color = COLOR.RED) {
        this.el = document.createElement("div");
        this.size = size;
        this.el.style.position = "absolute";
        this.el.style.backgroundColor = color;
        this.el.style.height = `${this.size}px`;
        this.el.style.width = `${this.size}px`;
        this.el.style.fontSize = "8px";
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
}
export default class Example extends BrowserGameEngine {
    onUserCreate() {
        this.subject = new Subject(10, 10, 0.1, 0.1);
        document.body.appendChild(this.subject.el);
        document.body.style.backgroundColor = COLOR.GREEN;
        document.body.style.margin = "0";
        document.body.style.width = "100vw";
        document.body.style.height = "100vh";
        return true;
    }
    onUserUpdate(elapsedTime) {
        this.subject.x += this.subject.dx * elapsedTime;
        this.subject.y += this.subject.dy * elapsedTime;
        if (this.subject.x < 0)
            this.subject.dx = Math.abs(this.subject.dx);
        if (this.subject.x > window.innerWidth - this.subject.size)
            this.subject.dx = -Math.abs(this.subject.dx);
        if (this.subject.y < 0)
            this.subject.dy = Math.abs(this.subject.dy);
        if (this.subject.y > window.innerHeight - this.subject.size)
            this.subject.dy = -Math.abs(this.subject.dy);
        return true;
    }
    onUserRender() {
        this.subject.el.style.left = `${this.subject.x}px`;
        this.subject.el.style.top = `${this.subject.y}px`;
        return true;
    }
}
