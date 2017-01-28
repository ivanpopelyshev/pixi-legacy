import Application from "./Application";

if (!PIXI.Ticker && PIXI.ticker) {
    Object.assign(PIXI, PIXI.ticker);
}

if (!PIXI.Application) {
    PIXI.Application = Application;
}

module.exports = PIXI;
