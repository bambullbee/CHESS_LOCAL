import webpack from "webpack";
import path from "path";

import { buildWebpack } from "./config/build/buildWebpack";

import type { BuildMode } from "./config/build/types/types";
import type { BuildPlatform } from "./config/build/types/types";
interface EnvVariables {
  mode: BuildMode;
  port: number;
  analyzer?: string;
  platform: BuildPlatform;
}

//module.exports возвращает функцию, а не объект, так как нам важно использовать переменные, например, среды окружения(последние были заданы в скриптах для build)
// mode: env.mode ?? "development" также мы добавили дефолтное значение, если переменная не указана

export default (env: EnvVariables) => {
  const paths = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: path.resolve(__dirname, "dist"),
    html: path.resolve(__dirname, "public", "index.html"),
    src: path.resolve(__dirname, "src"),
    public: path.resolve(__dirname, "public"),
  };

  const isDev = env.mode === "development";

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? "development",
    paths,
    analyzer: env.analyzer,
    platform: env.platform ?? "desktop",
  });

  return config;
};
