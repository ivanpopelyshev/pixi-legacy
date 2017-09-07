import Application from "./Application";
import RendererPatcher from "./RendererPatcher";
import FilterPatcherV3 from "./FilterPatcherV3";

RendererPatcher(PIXI.CanvasRenderer.prototype);
RendererPatcher(PIXI.WebGLRenderer.prototype);

if (!PIXI.Ticker && PIXI.ticker) {
    Object.assign(PIXI, PIXI.ticker);
}

if (!PIXI.Application) {
    PIXI.Application = Application;
}

if (!PIXI.filters.VoidFilter) {
    FilterPatcherV3(PIXI);
}

if (!PIXI.particles) {
    PIXI.particles = {
        ParticleContainer: PIXI.ParticleContainer
    };
} else {
    PIXI.ParticleContainer = PIXI.particles.ParticleContainer;
}

module.exports = PIXI;
