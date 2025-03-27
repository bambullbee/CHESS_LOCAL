import { createSlice } from "@reduxjs/toolkit";

import getStartFigure from "@/entities/Cell/helpers/getStartFigure";
import { Figure } from "@/entities/Cell";

interface Cells {
  [key: number]: {
    figure: Figure;
    isDefendingKing: boolean;
  };
}

const CELLS: Cells = {};

type rowsNcols = number[][];

const ROWS: rowsNcols = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 })
);

const COLUMNS: rowsNcols = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 })
);

for (let e = 0; e < 7; e++) {
  for (let i = 0; i < 7; i++) {
    const id = (e + 1) * 8 + i + 1;
    ROWS[e][i] = id;
    COLUMNS[i][e] = id;
    CELLS[id] = {
      figure: getStartFigure(e + 1, i + 1),
      isDefendingKing: false,
    };
  }
}

const boardSlice = createSlice({
  name: "board",
  initialState: { rows: ROWS, cols: COLUMNS, cells: CELLS },
  reducers: {},
});

export default boardSlice.reducer;
