import { readFile, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { rollup } from "npm:rollup";
import esbuild from "npm:rollup-plugin-esbuild";
import commonjs from "npm:@rollup/plugin-commonjs";
import nodeResolve from "npm:@rollup/plugin-node-resolve";

const plugins = [
  nodeResolve(),
  commonjs(),
  esbuild({
    minify: true,
    target: "es2017",
    jsx: "automatic",
  }),
];

for (const plug of await readdir("./plugins")) {
  if (plug == "common") continue;

  const manifestPath = `./plugins/${plug}/manifest.json`;
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  const outPath = `./dist/${plug}/index.js`;

  const bundle = await rollup({
    input: `./plugins/${plug}/${manifest.main}`,
    plugins,
    onwarn: () => {},
  });

  await bundle.write({
    file: outPath,
    format: "iife",
    exports: "named",
    compact: true,
    globals(id) {
      if (id.startsWith("@vendetta")) {
        return id.substring(1).replace(/\//g, ".");
      }
      if (id === "react") return "window.React";
      return null;
    },
  });

  await bundle.close();

  const output = await readFile(outPath);
  manifest.hash = createHash("sha256").update(output).digest("hex");
  manifest.main = "index.js";

  await writeFile(`./dist/${plug}/manifest.json`, JSON.stringify(manifest));

  console.log(`Built ${manifest.name}`);
}
