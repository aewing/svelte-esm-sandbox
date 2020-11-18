const ws = new WebSocket("ws://localhost:9015/");
ws.addEventListener("open", function open() {
  console.log("Connected");
  ws.send(Date.now());
});
ws.addEventListener("close", function close() {
  console.log("disconnected");
});
ws.addEventListener("message", function message(event) {
  if (
    window._hmr &&
    window._hmr.path /* && window._hmr.path === `/_client/${event.data}` */
  ) {
    import(`${window._hmr.path}?t=${Date.now()}`).then(
      ({ default: Component }) => {
        console.log("HMR reload");
        new Component({
          target: document.getElementById("app"),
          hydrate: true,
          props: window._hmr.context,
        });
      }
    );
  }
});
