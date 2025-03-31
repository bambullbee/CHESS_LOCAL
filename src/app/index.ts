import App from "./App";
import {
  getCellNewInfo,
  changeChosenCell,
  getAttackingInfo,
} from "./slices/boardSlice";
import { store } from "./store";

import type { RootState } from "./store";

export {
  App,
  store,
  getCellNewInfo,
  changeChosenCell,
  getAttackingInfo,
  type RootState,
};
