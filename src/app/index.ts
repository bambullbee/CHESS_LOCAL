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

import {
  changePage,
  chooseGame,
} from "./slices/navigationSlice/navigationSlice";

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
  changePage,
  chooseGame,
  type RootState,
};
