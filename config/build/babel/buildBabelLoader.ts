import type { BuildOptions } from "../types/types";
import { removeDataTestIdBabelPlugin } from "./removeDataTestIdBabelPlugin";

export function buildBabelLoader(options: BuildOptions) {
  const { mode } = options;
  const isDev = mode === "development";

  const plugins = [];

  if (isDev) {
  }

  if (!isDev) {
    plugins.push([
      removeDataTestIdBabelPlugin,
      {
        props: ["data-testid"],
      },
    ]);
  }

  return {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      //значение ключа options можно вынести в отдельный файлик babel.config.json, обычно полезно при параллельной работе с jest
      options: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-typescript",
          [
            "@babel/preset-react",
            {
              runtime: "automatic",
            },
          ],
        ],
        plugins: plugins.length ? plugins : undefined,
      },
    },
  };
}
