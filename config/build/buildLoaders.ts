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

  const cssLoader = {
    test: /\.css$/i,
    use: [
      isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: isDev
              ? "[path][name]__[local]"
              : "[hash:base-64:8]",
          },
        },
      },
      "postcss-loader",
    ],
  };

  const babelLoader = buildBabelLoader(options);

  return [assetLoader, cssLoader, babelLoader];
}
