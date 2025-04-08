import App from "./App";
import {
  getCellNewInfo,
  changeChosenCell,
  getAttackingInfo,
  moveFigure,
  changeTurn,
  defineNotTouchedCells,
  definePawnStep,
  resetBoardSlice,
} from "./slices/boardSlice/boardSlice";
import { store } from "./store";

import type { RootState } from "./store";

export {
  App,
  store,
  getCellNewInfo,
  changeChosenCell,
  getAttackingInfo,
  moveFigure,
  changeTurn,
  defineNotTouchedCells,
  definePawnStep,
  resetBoardSlice,
  type RootState,
};
