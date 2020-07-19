export class Color {
    constructor(r = 0, g = 0, b = 0, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    static get WHITE() {
        return new Color(255, 255, 255);
    }
    static get BLACK() {
        return new Color(0, 0, 0, 255);
    }
    static get RED() {
        return new Color(255, 0, 0, 255);
    }
    static get GREEN() {
        return new Color(0, 255, 0, 255);
    }
    static get BLUE() {
        return new Color(0, 0, 255, 255);
    }
    withAlpha(value) {
        return new Color(this.r, this.g, this.b, value);
    }
    toString() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
}
export class BrowserGameEngine {
    constructor(maxUPS = 60, maxFPS = 60) {
        this.container = document.createElement("div");
        this.maxUpdates = 240;
        this.lastFPSAverageTimestamp = 0;
        this.elapsedTime = 0;
        this.weightedFPSAverage = 0;
        this.framesThisIteration = 0;
        this.fpsAverageWeight = 0.25;
        this.started = false;
        this.maxUPS = maxUPS;
        this.maxFPS = maxFPS;
    }
    set maxFPS(value) {
        this._maxFPS = value;
        this.minRenderDelay = 1000 / this._maxFPS;
    }
    set maxUPS(value) {
        this._maxUPS = value;
        this.minUpdateDelay = 1000 / this._maxUPS;
    }
    get fps() {
        return this.weightedFPSAverage;
    }
    start() {
        // start main loop
        if (!this.started && this.create())
            this.nextAnimationFrame = requestAnimationFrame((timestamp) => {
                if (this.initialRender())
                    this.renderFrom(timestamp);
            });
        this.started = true;
    }
    stop() {
        if (this.started && this.destroy()) {
            cancelAnimationFrame(this.nextAnimationFrame);
            this.elapsedTime = 0;
            this.weightedFPSAverage = 0;
            this.framesThisIteration = 0;
            this.started = false;
        }
    }
    panic() {
        this.elapsedTime = 0;
        return true;
    }
    initialRender() {
        return true;
    }
    destroy() {
        return true;
    }
    renderFrom(timestamp) {
        this.nextAnimationFrame = requestAnimationFrame(this.renderLoop.bind(this, timestamp));
    }
    renderLoop(lastTimestamp, currentTimestamp) {
        this.elapsedTime += currentTimestamp - lastTimestamp;
        // skip render if rendering too fast
        if (this.elapsedTime < this.minRenderDelay)
            return this.renderFrom(lastTimestamp);
        // track average fps
        if (currentTimestamp > this.lastFPSAverageTimestamp + 1000)
            this.updateFPSWeightedAverage(currentTimestamp);
        // update with a constant delta
        // until all the time between frames is used up
        let numUpdates = 0;
        while (this.elapsedTime > this.minUpdateDelay &&
            this.update(this.minUpdateDelay)) {
            this.elapsedTime -= this.minUpdateDelay;
            if (++numUpdates >= this.maxUpdates && this.panic())
                break;
        }
        // render & continue loop
        this.framesThisIteration++;
        if (this.render())
            this.renderFrom(currentTimestamp);
    }
    updateFPSWeightedAverage(currentTimestamp) {
        const msSinceLastIteration = currentTimestamp - this.lastFPSAverageTimestamp;
        const weightedFPSThisIteration = this.fpsAverageWeight * this.framesThisIteration;
        const reweightedFPSLastIteration = (1 - this.fpsAverageWeight) * this.weightedFPSAverage;
        this.weightedFPSAverage =
            (weightedFPSThisIteration * 1000) / msSinceLastIteration +
                reweightedFPSLastIteration;
        this.framesThisIteration = 0;
        this.lastFPSAverageTimestamp = currentTimestamp;
    }
}
BrowserGameEngine.APP_NAME = "Browser App";
