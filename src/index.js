import Application from "./Application";
import RendererPatcher from "./RendererPatcher";
import FilterPatcherV3 from "./FilterPatcherV3";
import InteractionPatcherV3 from "./InteractionPatcher";

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

let module = {
	patchV3InteractionMask: function(arg) {
		InteractionPatcherV3(arg || PIXI);
    }
};

PIXI.legacy = module;
module.exports = legacy;
