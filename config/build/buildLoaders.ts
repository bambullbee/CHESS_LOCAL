import { ModuleOptions } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BuildOptions } from "./types/types";
//не удалять!!!
import ReactRefreshTypeScript from "react-refresh-typescript";

import { buildBabelLoader } from "./babel/buildBabelLoader";

export function buildLoaders(options: BuildOptions): ModuleOptions["rules"] {
  const { mode, paths } = options;
  const isDev = mode === "development";

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: "asset/resource",
  };

  const cssLoaderWithModules = {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: isDev ? "[path][name]__[local]" : "[hash:base-64:8]",
      },
    },
  };

  // const cssLoader = {
  //   test: /\.css$/i,
  //   use: [
  //     isDev ? "style-loader" : MiniCssExtractPlugin.loader,
  //     cssLoaderWithModules,
  //   ],
  // }; cssLoaderWithModules DONT WORK WITH POSTCSSLOADER

  const cssLoader = {
    test: /\.css$/i,
    use: [
      isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      "css-loader",
      "postcss-loader",
    ],
  };

  // const tsLoader = {
  //   exclude: /node_modules/,
  //   test: /\.tsx?$/,
  //   use: [
  //     {
  //       loader: "ts-loader",
  //       options: {
  //         transpileOnly: true,

  //         getCustomTransformers: () => ({
  //           before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
  //         }),
  //       },
  //     },
  //   ],
  // };

  const babelLoader = buildBabelLoader(options);

  //позволяет использовать свг как реакт компоненты
  const svgrLoader = {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: [{ loader: "@svgr/webpack", options: { icon: true } }],
  };

  return [assetLoader, cssLoader, babelLoader, svgrLoader];
}
