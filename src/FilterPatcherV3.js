export default function FilterPatcherV3(PIXI) {

    var CONST = PIXI;
    var AbstractFilter = PIXI.AbstractFilter;
    var WebGLRenderer = PIXI.WebGLRenderer;

    PIXI.filters.VoidFilter = AbstractFilter;

    AbstractFilter.prototype.blendMode = 0;

    function FilterManager_popFilter()
    {
        var filterData = this.filterStack.pop();
        var previousFilterData = this.filterStack[this.filterStack.length-1];

        var input = filterData.renderTarget;

        // if the renderTarget is null then we don't apply the filter as its offscreen
        if(!filterData.renderTarget)
        {
            return;
        }

        var output = previousFilterData.renderTarget;

        // use program
        var gl = this.renderer.gl;


        this.currentFrame = input.frame;

        this.quad.map(this.textureSize, input.frame);


        // TODO.. this probably only needs to be done once!
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.quad.indexBuffer);

        var filters = filterData.filter;

        // assuming all filters follow the correct format??
        gl.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 2 * 4 * 4);
        gl.vertexAttribPointer(this.renderer.shaderManager.defaultShader.attributes.aColor, 4, gl.FLOAT, false, 0, 4 * 4 * 4);

        // restore the normal blendmode!
        this.renderer.blendModeManager.setBlendMode(CONST.BLEND_MODES.NORMAL);

        if (filters.length === 1)
        {
            // TODO (cengler) - There has to be a better way then setting this each time?
            if (filters[0].uniforms.dimensions)
            {
                filters[0].uniforms.dimensions.value[0] = this.renderer.width;
                filters[0].uniforms.dimensions.value[1] = this.renderer.height;
                filters[0].uniforms.dimensions.value[2] = this.quad.vertices[0];
                filters[0].uniforms.dimensions.value[3] = this.quad.vertices[5];
            }

            this._filterBlendMode = filters[0].blendMode;
            filters[0].applyFilter( this.renderer, input, output );
            this.returnRenderTarget( input );

        }
        else
        {
            var flipTexture = input;
            var flopTexture = this.getRenderTarget(true);

            for (var i = 0; i < filters.length-1; i++)
            {
                var filter = filters[i];

                // TODO (cengler) - There has to be a better way then setting this each time?
                if (filter.uniforms.dimensions)
                {
                    filter.uniforms.dimensions.value[0] = this.renderer.width;
                    filter.uniforms.dimensions.value[1] = this.renderer.height;
                    filter.uniforms.dimensions.value[2] = this.quad.vertices[0];
                    filter.uniforms.dimensions.value[3] = this.quad.vertices[5];
                }

                this._filterBlendMode = filter.blendMode;
                filter.applyFilter( this.renderer, flipTexture, flopTexture );

                var temp = flipTexture;
                flipTexture = flopTexture;
                flopTexture = temp;
            }

            this._filterBlendMode = filters[filters.length-1].blendMode;
            filters[filters.length-1].applyFilter( this.renderer, flipTexture, output );

            this.returnRenderTarget( flipTexture );
            this.returnRenderTarget( flopTexture );
        }
        this._filterBlendMode = 0;

        return filterData.filter;
    }

    function FilterManager_applyFilter(shader, inputTarget, outputTarget, clear) {
        var gl = this.renderer.gl;

        this.renderer.setRenderTarget(outputTarget);

        if (clear)
        {
            outputTarget.clear();
        }

        this.renderer.shaderManager.setShader(shader);

        shader.uniforms.projectionMatrix.value = this.renderer.currentRenderTarget.projectionMatrix.toArray(true);

        shader.syncUniforms();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, inputTarget.texture);

        this.renderer.blendModeManager.setBlendMode(this._filterBlendMode);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

        this.renderer.blendModeManager.setBlendMode(CONST.BLEND_MODES.NORMAL);
        this.renderer.drawCount++;
    }

    WebGLRenderer.prototype._mapGlModes = function ()
    {
        this.filterManager.applyFilter = FilterManager_applyFilter;
        this.filterManager.popFilter = FilterManager_popFilter;

        var gl = this.gl;

        if (!this.blendModes)
        {
            this.blendModes = {};

            this.blendModes[CONST.BLEND_MODES.NORMAL]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.ADD]           = [gl.ONE,       gl.DST_ALPHA];
            this.blendModes[CONST.BLEND_MODES.MULTIPLY]      = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.SCREEN]        = [gl.ONE,       gl.ONE_MINUS_SRC_COLOR];
            this.blendModes[CONST.BLEND_MODES.OVERLAY]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.DARKEN]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.LIGHTEN]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.COLOR_DODGE]   = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.COLOR_BURN]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.HARD_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.SOFT_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.DIFFERENCE]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.EXCLUSION]     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.HUE]           = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.SATURATION]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.COLOR]         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
            this.blendModes[CONST.BLEND_MODES.LUMINOSITY]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        }

        if (!this.drawModes)
        {
            this.drawModes = {};

            this.drawModes[CONST.DRAW_MODES.POINTS]         = gl.POINTS;
            this.drawModes[CONST.DRAW_MODES.LINES]          = gl.LINES;
            this.drawModes[CONST.DRAW_MODES.LINE_LOOP]      = gl.LINE_LOOP;
            this.drawModes[CONST.DRAW_MODES.LINE_STRIP]     = gl.LINE_STRIP;
            this.drawModes[CONST.DRAW_MODES.TRIANGLES]      = gl.TRIANGLES;
            this.drawModes[CONST.DRAW_MODES.TRIANGLE_STRIP] = gl.TRIANGLE_STRIP;
            this.drawModes[CONST.DRAW_MODES.TRIANGLE_FAN]   = gl.TRIANGLE_FAN;
        }
    };
}