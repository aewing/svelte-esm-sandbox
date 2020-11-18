import fs from "fs";
import path from "path";

export async function spaMiddleware(req, res) {
  let clientSource;
  let serverSource;
  let segments = req.path.split("/").filter((v) => v.length);
  if (!segments.length) {
    segments = ["index"];
  }
  const matched = [];
  while (!serverSource && segments.length) {
    const full = segments.join("/");
    matched.push(segments.pop());
    const remaining = segments.join("/");
    [
      `${full}.mjs`,
      `${full}/index.mjs`,
      `${remaining}${remaining.length ? "/" : ""}[slug].mjs`,
      `${remaining}${remaining.length ? "/" : ""}[...slug].mjs`,
    ].some((potentialFile) => {
      const serverFile = path.resolve(
        process.cwd(),
        "build/server/routes",
        potentialFile
      );
      const clientFile = path.resolve(
        process.cwd(),
        "build/client/routes",
        potentialFile
      );
      if (fs.existsSync(serverFile) && fs.existsSync(clientFile)) {
        clientSource = `/_client/routes/${potentialFile}`;
        serverSource = serverFile;
        return true;
      }
    });
  }

  if (!serverSource) {
    res.writeHead(404);
    return res.end("Source Not Found");
  }

  try {
    const { preload, default: Component } = await import(
      `${serverSource}?t=${new Date().valueOf()}`
    );
    let context = {};
    if (preload) {
      context = await preload({ slug: matched.reverse() });
    }
    const { html, css, head } = Component.render(context);
    res.writeHead(200, { "Content-Type": "text/html" });

    const template = fs.readFileSync("src/template.html").toString();
    return res.end(
      template
        .replace("<!-- head -->", head)
        .replace("<!-- css -->", `<style type="text/css">${css.code}</style>`)
        .replace(
          "<!-- script -->",
          `<script type="module" language="text/javascript">
      window._hmr = ${JSON.stringify({
        path: clientSource,
        context,
      })};
      import Route from "${clientSource}";
      new Route({ target: document.getElementById("app"), hydrate: true, props: ${JSON.stringify(
        context
      )} })
    </script>`
        )
        .replace("<!-- body -->", html)
    );
  } catch (err) {
    console.error(err);
  }

  res.writeHead(500);
  return res.end("Server Error");
}
