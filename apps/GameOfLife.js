import BrowserGameEngine from "../olc.js";
export default class GameOfLife extends BrowserGameEngine {
    onUserCreate() {
        return false;
    }
    onUserRender() {
        return false;
    }
    onUserUpdate(elapsedTime) {
        return false;
    }
}
