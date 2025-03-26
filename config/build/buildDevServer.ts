import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { BuildOptions } from "./types/types";

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
  const { port } = options;
  return {
    port: port ?? 3000,
    open: true,
    //чтобы работал react-router-dom а именно клиентская маршрутизация, навигация с помощью js работает только для devserver, про деплой front end узнай из ролика ulbi tv
    historyApiFallback: true,
    //hot module replacement. prevents page reloading after editting code. live-sync live-server with code
    hot: true,
  };
}
