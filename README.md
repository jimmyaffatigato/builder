# `builder`

Portable bundling script for `esbuild` with easy-access JSON options.

`build.js` invokes the nearest `esbuild` installation with the options in `build-options.json`.

## Usage

Put `build.js` in the package directory.

Run `node build.js`.

If `build-options.json` is not detected in the same directory, it will generate a JSON template file with `buildOptions` and `serveOptions` properties, then exit.

```json
{
  "buildOptions": {

  },
  "serveOptions": {

  }
}
```

`buildOptions` is parsed as an [`esbuild.BuildOptions`](node_modules/esbuild/lib/main.d.ts) object.

Reference: https://esbuild.github.io/api/#build

`serveOptions` is parsed as an [`esbuild.ServeOptions`](node_modules/esbuild/lib/main.d.ts) object.

Reference: https://esbuild.github.io/api/#serve

---

Use `build.js --watch` for esbuild's watch mode.

Use `build.js --serve` for esbuild's serve mode (using `serveOptions` from `build-options.json`).

## Example

```json
// build-options.json

{
  "buildOptions": {
    "entryPoints": ["src/index.ts"],
    "bundle": true,
    "outfile": "dist/index.js",
    "platform": "node"
  },
  "serveOptions": {
    "serveDir": "dist"
  }
}
```

---
This package directory is a working example.

The included `build-options.json` file in this package is the build options for this version of builder.

v1.0.0 of builder was built with builder v1.0.0
