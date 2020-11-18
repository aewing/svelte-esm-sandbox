import chokidar from "chokidar";
import fs from "fs";
import { throttle } from "throttle-debounce";
import WebSocket from "ws";
import { compileAll } from "./compile.js";
import config from "./svelte.config.js";

export default function watch(
  pattern = "src/**/*.svelte",
  options = {},
  fn = null
) {
  console.log("Creating websocket server...");
  const wss = new WebSocket.Server({
    port: 9015,
  });

  const broadcast = (message) => {
    return (
      wss &&
      wss.clients &&
      wss.clients.forEach((client) => client.send(message))
    );
  };

  console.log("Listening for file changes...");
  chokidar.watch(pattern, options).on(
    "all",
    throttle(1000, true, async (event, filename) => {
      if ((!fn || fn(event, filename)) && fs.existsSync(filename)) {
        await compileAll(config.preprocess);
        broadcast("hmr");
      }
    })
  );
}
