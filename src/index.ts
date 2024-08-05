import * as esbuild from "esbuild";
import { argv } from "process";
import { readFile, writeFile } from "fs/promises";

interface OptionsJSON {
  buildOptions: esbuild.BuildOptions;
  serveOptions: esbuild.ServeOptions;
}

start();

async function start() {
  // Help Output
  if (argv[2] == "--help" || argv[2] == "--h") {
    const help = [
      "builder v1.0.0 - Help",
      "Portable bundling script for `esbuild` with easy-access JSON options.",
      "`build.js` invokes the nearest `esbuild` installation with the options in `build-options.json`.",
      "\nUsage:",
      "node build.js",
      "node build.js --watch",
      "node build.js --serve",
      "node build.js --help",
    ];

    help.forEach((line) => {
      console.log(line);
    });
    return;
  }
  console.log(`builder v1.0.0`);
  console.log(`esbuild v${esbuild.version}`);

  let optionsFile: string;

  try {
    optionsFile = await readFile("build-options.json", "utf-8");
  } catch {
    console.log(`No options file found. \`Creating build-options.json\``);
    await writeFile(
      "build-options.json",
      JSON.stringify({ buildOptions: {}, serveOptions: {} })
    );
    return;
  }

  const { buildOptions, serveOptions } = JSON.parse(optionsFile) as OptionsJSON;

  if (buildOptions?.entryPoints) {
    console.log(
      `Entry points: ${(buildOptions.entryPoints as string[]).join(", ")}`
    );
  }
  if (buildOptions?.outfile) {
    console.log(`Outfile: ${buildOptions.outfile}`);
  }
  if (buildOptions?.platform) {
    console.log(`Platform: ${buildOptions.platform}`);
  }

  buildOptions.metafile = true;

  if (argv[2]) {
    const arg = argv[2];
    buildOptions.define = {};
    buildOptions.define.COMPILETIME = `"${new Date().toLocaleString()}"`;
    const context = await esbuild.context(buildOptions);

    if (arg == "--serve") {
      const server = await context.serve(serveOptions);
      console.log(
        `Server hosting ${
          serveOptions?.servedir ? serveOptions.servedir : ""
        } at ${server.host}:${server.port}`
      );
    } else if (arg == "--watch") {
      await context.watch();
      console.log("Watching");
    }
  } else {
    const startTime = performance.now();
    const result = await esbuild.build(buildOptions);
    const finishTime = performance.now();
    const analysis = await esbuild.analyzeMetafile(result.metafile, {
      verbose: true,
    });
    console.log(analysis);
    console.log(`Completed in ${(finishTime - startTime).toFixed(0)}ms`);
  }
}
