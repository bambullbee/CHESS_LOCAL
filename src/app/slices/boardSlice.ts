import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import getStartFigure from "@/entities/Cell/helpers/getStartFigure";
import { getAttackedCells } from "@/shared";

import type { Cell } from "@/shared";

type rowsNcols = number[][];

interface Cells {
  [key: number]: Cell;
}

interface initialStateI {
  rows: rowsNcols;
  cells: Cells;
  chosenCell: number | null;
}

const CELLS: Cells = {};

const ROWS: rowsNcols = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 })
);

for (let e = 0; e <= 7; e++) {
  for (let i = 0; i <= 7; i++) {
    const id = (e + 1) * 8 - (8 - i - 1);
    const startFigure = getStartFigure(e + 1, i + 1);

    ROWS[e][i] = id;
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

const initialState: initialStateI = {
  rows: ROWS,
  cells: CELLS,
  chosenCell: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    changeChosenCell(state, action: PayloadAction<number | null>) {
      state.chosenCell = action.payload;
    },
    changeAttackedState(state, action: PayloadAction<number>) {
      state.cells[action.payload].isAttacked =
        !state.cells[action.payload].isAttacked;
    },
  },
});

export default boardSlice.reducer;

export const { changeChosenCell, changeAttackedState } = boardSlice.actions;
