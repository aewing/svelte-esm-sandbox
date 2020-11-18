import polka from "polka";
import sirv from "sirv";
import fs from "fs";
import { spaMiddleware } from "./util/middleware.js";

const dev = process.env.NODE_ENV !== "production";

if (!dev) {
  import("./util/compile.js").then(({ compileAll }) => {
    compileAll();
  });
}
polka({
  onNoMatch: spaMiddleware,
})
  .use("/_ws.js", (req, res) => {
    const buffer = fs.readFileSync("node_modules/ws/browser.js").toString();
    res.writeHead(200, { "Content-Type": "application/javascript" });
    return res.end(buffer);
  })
  .use("/_svelte", sirv("node_modules/svelte/", { dev: true }))
  .use("/_client", sirv("build/client/", { dev: true }))
  .use(sirv("static", { dev: true }))
  .listen(3000, (err) => {
    if (err) throw err;
    console.log(`> http://localhost:3000`);

    if (dev) {
      import("./util/watch.js").then(({ default: watch }) => {
        console.log("Watching for file changes...");
        watch();
      });
    }
  });
