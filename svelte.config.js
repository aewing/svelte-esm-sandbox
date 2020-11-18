const preprocess = require("svelte-preprocess");
const postcss = require("./postcss.config.js");

module.exports = {
  preprocess: [
    preprocess({
      postcss,
    }),
  ],
};
