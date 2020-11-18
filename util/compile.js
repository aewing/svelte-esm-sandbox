import fs from "fs";
import path from "path";
import * as svelte from "svelte/compiler";
import glob from "glob";

export function compileAll(preprocess = false, verbose = false) {
  console.log("Compiling...");
  const matches = glob.sync("src/**/*.svelte");
  return Promise.all(matches.map((file) => compile(file, preprocess, verbose)));
}

export default async function compile(
  filename,
  preprocess = false,
  verbose = false
) {
  verbose && console.log(`> ${filename}`);
  const destination = filename.substr(4).replace(".svelte", ".mjs");
  let source = fs.readFileSync(filename).toString();
  if (preprocess) {
    const preprocessed = await svelte.preprocess(source, preprocess, {
      filename,
    });
    source = preprocessed.toString();
  }
  const server = svelte.compile(source, {
    filename: `./build/server/${destination}`,
    generate: "ssr",
    hydratable: true,
  });
  writeFile(`./build/server/${destination}`, server.js.code, verbose);
  const client = svelte.compile(source, {
    filename: `/_build/${destination}`,
    generate: "dom",
    format: "esm",
    hydratable: true,
    sveltePath: "/_svelte",
  });
  writeFile(
    `./build/client/${destination}`,
    client.js.code.replace("_svelte/internal", "_svelte/internal/index.mjs"),
    verbose
  );
  return destination;
}

export function writeFile(filename, buffer, verbose = false) {
  const dirname = path.dirname(filename);
  if (!fs.existsSync(dirname)) {
    verbose && console.log(`  +${dirname}`);
    fs.mkdirSync(dirname, { recursive: true });
  }
  verbose && console.log(`    +${filename}`);
  fs.writeFileSync(
    filename,
    buffer.replace(
      /import ([a-zA-Z_]+) from "(.*).svelte";/g,
      (full, name, path) => `import ${name} from "${path}.mjs?t=${Date.now()}";`
    )
  );
}
