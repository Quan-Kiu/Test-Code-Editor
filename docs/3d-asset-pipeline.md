# 3D Asset Pipeline — Prototype

## Current asset policy

Runtime world assets in WB-001 are authored from Three.js primitives and materials in code. The generated concept PNGs are design references only, kept in `design-assets/`; they are not runtime meshes or textures.

## Future imported asset policy

Any GLB/glTF, textures or audio added later must record source, license, approximate runtime size, optimization status and fallback behavior before inclusion in the player build.
