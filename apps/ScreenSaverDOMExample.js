import { BrowserGameEngine, Color } from "../olc.js";
class Subject {
    constructor(size, x, y) {
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
    get topBound() {
        return this.container.offsetTop;
    }
    get rightBound() {
        return (this.container.offsetLeft + this.container.offsetWidth - this.subject.size);
    }
    get bottomBound() {
        return (this.container.offsetTop + this.container.offsetHeight - this.subject.size);
    }
    get leftBound() {
        return this.container.offsetLeft;
    }
    create() {
        const size = 50;
        this.subject = new Subject(size, Math.floor(Math.random() * (window.innerWidth - size)), Math.floor(Math.random() * (window.innerHeight - size)));
        return true;
    }
    initialRender() {
        this.subject.el.style.textAlign = "center";
        this.container.appendChild(this.subject.el);
        return true;
    }
    render() {
        document.title = `${ScreenSaverDOMExample.APP_NAME} - FPS: ${this.fps.toFixed(2)}`;
        this.subject.el.style.left = `${this.subject.x}px`;
        this.subject.el.style.top = `${this.subject.y}px`;
        return true;
    }
    update(elapsedTime) {
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
ScreenSaverDOMExample.APP_NAME = "Screen Saver";
