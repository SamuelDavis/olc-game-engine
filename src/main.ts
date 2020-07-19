import ScreenSaverDOMExample from "./apps/ScreenSaverDOMExample.js";
import GameOfLifeDOMExample from "./apps/GameOfLifeDOMExample.js";
import NoiseCanvasExample from "./apps/NoiseCanvasExample.js";
import { BrowserGameEngine } from "./olc.js";

type AppConstructor = new (...args) => BrowserGameEngine;

const appSelect: HTMLSelectElement = document.createElement("select");
const apps = [ScreenSaverDOMExample, GameOfLifeDOMExample, NoiseCanvasExample];
let currentApp: BrowserGameEngine;

function bootApp(App: AppConstructor): void {
  if (currentApp) {
    document.body.removeChild(currentApp.container);
    currentApp.stop();
  }
  currentApp = new App();
  currentApp.container.style.flexGrow = "1";
  document.body.appendChild(currentApp.container);
  currentApp.start();
}

document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.width = "fit-content";
document.body.style.height = "fit-content";
document.body.style.minWidth = "100vw";
document.body.style.minHeight = "100vh";
appSelect.style.width = "100%";

appSelect.addEventListener("change", () => {
  bootApp(apps[appSelect.selectedIndex]);
});
apps.forEach((App, i) => {
  const option = document.createElement("option");
  option.innerText = `${i + 1}: ${App.APP_NAME}`;
  option.value = String(i);
  appSelect.appendChild(option);
});

export default function (): void {
  document.body.appendChild(appSelect);
  document.body.appendChild(document.createElement("hr"));
  bootApp(apps[0]);
}
