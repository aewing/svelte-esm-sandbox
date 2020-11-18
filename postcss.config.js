const presetEnv = require("postcss-preset-env");
const fontMagician = require("postcss-font-magician");

module.exports = {
  plugins: [presetEnv({ stage: 0 }), fontMagician()],
};
