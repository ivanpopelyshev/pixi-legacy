# pixi-legacy

Sometimes things break. Sometimes new API is introduced. Sometimes old API gets deprecated.

This plugin allows to use new API's with old versions of PIXI, starting from v3.0.11

It is also supposed to add old API's and remove things that were "deprecated" and used widely

Binaries are in "bin" folder.

### Features backported to v3

1. VoidFilter
2. filter.blendMode

### Features backported to v4.2

1. Application
2. renderer.screen

### Renamings

1. PIXI.particles.ParticleContainer <=> ParticleContainer

### Build

```bash
npm install
npm run build
```