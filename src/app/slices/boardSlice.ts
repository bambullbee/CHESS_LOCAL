import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

import {
  getAttackedCells,
  getStartFigure,
  initialStateI,
  type Cell,
  type Cells,
  type FigureColor,
  type FigureType,
} from "@/shared";
import { processedLongRangeAttackers } from "@/shared";

const CELLS: Cells = {};

const emptyCell: Cell = {
  figure: null,
  color: null,
  attacks: { doesAttackKing: false, range: [], availableCells: [] },
  attacked: {
    isFrozen: false,
    whoIsFieldUnderAttackBy: {
      directly: [],
      through: [],
      attackerColor: [],
    },
  },
  withPawnStep: false,
};

// инициализация доски

for (let e = 0; e <= 7; e++) {
  for (let i = 0; i <= 7; i++) {
    const id = (e + 1) * 8 - (8 - i - 1);

    CELLS[id] = {
      figure: null,
      color: null,
      attacks: { doesAttackKing: false, range: [], availableCells: [] },
      attacked: {
        isFrozen: false,
        whoIsFieldUnderAttackBy: {
          directly: [],
          through: [],
          attackerColor: [],
        },
      },
      withPawnStep: false,
    };
  }
}

const initialState: initialStateI = {
  cells: CELLS,
  chosenCell: null,
  check: {
    black: false,
    white: false,
  },
  turn: "white",
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    getCellNewInfo: (
      state,
      {
        payload: { id, shouldInitialize, selfCreate },
      }: PayloadAction<{
        id: number;
        shouldInitialize?: boolean;
        selfCreate?: { figure?: FigureType; colour?: FigureColor };
      }>
    ) => {
      const cell = state.cells[id];
      let startFigure: FigureType = cell.figure;
      let color: FigureColor = cell.color;
      if (shouldInitialize) {
        const res = getStartFigure(id);
        startFigure = res.startFigure;
        color = res.color;
      }
      if (selfCreate) {
        const { figure, colour } = selfCreate;
        startFigure = figure;
        color = colour;
      }
      cell.figure = startFigure;
      cell.color = color;
    },
    getAttackingInfo: (state, { payload }) => {
      let attackingInfo: processedLongRangeAttackers;
      if (state.cells[payload].figure === "pawn") {
        attackingInfo = getAttackedCells({
          figure: "pawn",
          id: payload,
          side: state.cells[payload].color === "white" ? 1 : 8,
          state,
        });
      } else {
        attackingInfo = getAttackedCells({
          figure: state.cells[payload].figure,
          id: payload,
          side: null,
          state,
        });
      }
      //???
      if (attackingInfo) {
        const { range, availableCells, frozenId, doesAttackKing } =
          attackingInfo;
        const cell = state.cells[payload];
        const attacks = cell.attacks;

        attacks.availableCells = availableCells.filter((id) => id);
        attacks.doesAttackKing = doesAttackKing;

        if (range) {
          attacks.range = range;
        } else {
          attacks.range = [];
        }

        if (frozenId) {
          state.cells[frozenId].attacked.isFrozen = true;
        }

        attacks.availableCells.forEach((attackedId) => {
          state.cells[
            attackedId
          ].attacked.whoIsFieldUnderAttackBy.directly.push(payload);
          const readableState = current(state);
          if (
            !readableState.cells[
              attackedId
            ].attacked.whoIsFieldUnderAttackBy.attackerColor.includes(
              cell.color
            )
          ) {
            state.cells[
              attackedId
            ].attacked.whoIsFieldUnderAttackBy.attackerColor.push(cell.color);
          }
        });
      }
    },
    changeChosenCell: (state, { payload }) => {
      if (state.chosenCell) {
        if (
          state.chosenCell === payload ||
          !Boolean(state.cells[payload].figure) ||
          state.cells[payload].color !== state.turn
        ) {
          state.chosenCell = null;
        } else if (state.turn === state.cells[payload].color) {
          state.chosenCell = payload;
        }
      } else if (state.cells[payload].color === state.turn) {
        state.chosenCell = payload;
      }
    },
  },
});

export default boardSlice.reducer;

export const { getCellNewInfo, changeChosenCell, getAttackingInfo } =
  boardSlice.actions;
