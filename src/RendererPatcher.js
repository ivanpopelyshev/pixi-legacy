export default function RendererPatcher(RendererProto) {
    if (RendererProto.hasOwnProperty("width")) {
        return;
    }
    RendererProto.screen = null;
    Object.defineProperties(RendererProto, {
        width: {
            get: function () {
                if (!this.screen) {
                    this.screen = new PIXI.Rectangle(0, 0, 1, 1);
                }
                return this.screen.width;
            },
            set: function (value) {
                if (!this.screen) {
                    this.screen = new PIXI.Rectangle(0, 0, 1, 1);
                }
                this.screen.width = value;
            }
        },
        height: {
            get: function () {
                if (!this.screen) {
                    this.screen = new PIXI.Rectangle(0, 0, 1, 1);
                }
                return this.screen.height;
            },
            set: function (value) {
                if (!this.screen) {
                    this.screen = new PIXI.Rectangle(0, 0, 1, 1);
                }
                this.screen.height = value;
            }
        }
    });
}