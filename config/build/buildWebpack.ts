import webpack from "webpack";

import { buildDevServer } from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import { buildPlugins } from "./buildPlugins";
import { buildResolvers } from "./buildResolvers";
import { BuildOptions } from "./types/types";

export function buildWebpack(options: BuildOptions): webpack.Configuration {
  const { mode, paths } = options;
  const isDev = mode === "development";
  return {
    mode: mode ?? "development", // "production" or 'development'
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: "[name].[contenthash].js",
      //обновлять каждый раз директорию бандла перед ребандлингом
      clean: true,
    },
    plugins: buildPlugins(options),
    module: {
      rules: buildLoaders(options),
    },
    resolve: buildResolvers(options),
    //source-map это инструмент, позволяющий удобно находить ошибку, открывая ее из консоли браузера! разные сурс мэпы подходят для разных по ВЕЛИЧИНЕ проектов и для разных режимов: prod/dev? build/rebuild?
    // таблица со встроенными сурс мапами здесь https://webpack.js.org/configuration/devtool/
    devtool: isDev ? "eval-cheap-module-source-map" : "source-map",
    devServer: isDev ? buildDevServer(options) : undefined,
  };
}
