export default class Application {
    constructor(width, height, options, noWebGL) {
        this.renderer = PIXI.autoDetectRenderer(width, height, options, noWebGL);

        this.stage = new PIXI.Container();

        this.ticker = new PIXI.Ticker();

        this.ticker.add(this.render, this);

        // Start the rendering
        this.start();
    }

    render() {
        this.renderer.render(this.stage);
    }

    stop() {
        this.ticker.stop();
    }

    start() {
        this.ticker.start();
    }

    get view() {
        return this.renderer.view;
    }

    get screen() {
        return this.renderer.screen;
    }

    destroy(removeView) {
        this.stop();
        this.ticker.remove(this.render, this);
        this.ticker = null;

        this.stage.destroy();
        this.stage = null;

        this.renderer.destroy(removeView);
        this.renderer = null;
    }
}
