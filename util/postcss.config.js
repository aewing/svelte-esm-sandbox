import presetEnv from "postcss-preset-env";
import fontMagician from "postcss-font-magician";

export default {
  plugins: [presetEnv({ stage: 0 }), fontMagician()],
};
