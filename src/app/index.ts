import App from "./App";
import { changeChosenCell, changeAttackedState } from "./slices/boardSlice";
import { store } from "./store";

import type { RootState } from "./store";

export { App, store, changeChosenCell, changeAttackedState, type RootState };
