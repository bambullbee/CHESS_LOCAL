import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import getStartFigure from "@/entities/Cell/helpers/getStartFigure";
import { getAttackedCells } from "@/shared";

import type { Cell } from "@/shared";

interface Cells {
  [key: number]: Cell;
}

interface initialStateI {
  cells: Cells;
  chosenCell: number | null;
}

const CELLS: Cells = {};

for (let e = 0; e <= 7; e++) {
  for (let i = 0; i <= 7; i++) {
    const id = (e + 1) * 8 - (8 - i - 1);
    const startFigure = getStartFigure(e + 1, i + 1);

    CELLS[id] = {
      figure: startFigure,
      attacks: getAttackedCells({ figure: startFigure, id, side: null }),
      isAttacked: false,
      color: e === 1 || e === 0 ? "white" : e === 6 || e === 7 ? "black" : null,
      withPawnStep: false,
    };

    if (startFigure === "pawn") {
      CELLS[id].attacks = getAttackedCells({
        figure: startFigure,
        id,
        side: e === 6 ? 8 : 1,
      });
    }
  }
}

for (let key in CELLS) {
  CELLS[key].attacks.forEach((id) => {
    switch (CELLS[key].figure) {
      case "bishop":

      case "rook":

      case "queen":

      default:
        return;
    }
  });
}

const initialState: initialStateI = {
  cells: CELLS,
  chosenCell: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    changeChosenCell(state, action: PayloadAction<number | null>) {
      if (state.chosenCell) {
        state.cells[state.chosenCell].attacks.forEach((id) => {
          state.cells[id].isAttacked = false;
        });
      }
      if (action.payload === state.chosenCell || action.payload === null) {
        state.chosenCell = null;
        return;
      }
      state.chosenCell = action.payload;
      state.cells[action.payload].attacks.forEach((id) => {
        state.cells[id].isAttacked = true;
      });
    },
  },
});

export default boardSlice.reducer;

export const { changeChosenCell } = boardSlice.actions;
