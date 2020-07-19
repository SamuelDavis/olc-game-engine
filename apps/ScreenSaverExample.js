import BrowserGameEngine, { COLOR } from "../olc.js";
class Subject {
    constructor(size, x, y) {
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
export default class ScreenSaverExample extends BrowserGameEngine {
    onUserCreate() {
        const size = 50;
        this.subject = new Subject(size, Math.floor(Math.random() * (window.innerWidth - size)), Math.floor(Math.random() * (window.innerHeight - size)));
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
        this.subject.el.innerText = `${this.fps.toFixed(2)} FPS`;
        return true;
    }
    onUserRender() {
        if (this.subject.el.parentElement !== document.body) {
            this.subject.el.style.textAlign = "center";
            document.body.style.margin = "0";
            document.body.style.width = "100vw";
            document.body.style.height = "100vh";
            document.body.appendChild(this.subject.el);
        }
        this.subject.el.style.left = `${this.subject.x}px`;
        this.subject.el.style.top = `${this.subject.y}px`;
        return true;
    }
}
