import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  getAttackedCells,
  getStartFigure,
  initialStateI,
  type Cell,
  type Cells,
  type FigureColor,
  type FigureType,
} from "@/shared";
import attackingInfoHandler from "./helpers/attackingInfoHandler";
import cellInfoHandler from "./helpers/cellInfoHandler";

const CELLS: Cells = {};

const emptyCell: Cell = {
  figure: null,
  color: null,
  attacks: {
    doesAttackKing: false,
    range: [],
    availableCells: [],
    isFreezer: { is: false, target: null },
  },
  attacked: {
    isFrozen: { is: false, byWhom: null },
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
      attacks: {
        doesAttackKing: false,
        range: [],
        availableCells: [],
        isFreezer: { is: false, target: null },
      },
      attacked: {
        isFrozen: { is: false, byWhom: null },
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
    black: { is: false, byWhom: [] },
    white: { is: false, byWhom: [] },
  },
  turn: "white",
  pawnStep: {
    is: false,
    pawn: null,
    steppedField: null,
  },
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
      cellInfoHandler(state, id, shouldInitialize, selfCreate);
    },
    getAttackingInfo: (state, { payload }) => {
      attackingInfoHandler(state, payload);
    },
    moveFigure: (state, { payload }: PayloadAction<number>) => {
      if (state.pawnStep.steppedField) {
        state.cells[state.pawnStep.steppedField].withPawnStep = false;
      }
      state.pawnStep = {
        is: false,
        pawn: null,
        steppedField: null,
      };
      const cells = state.cells;
      const cc = cells[state.chosenCell];
      if (
        cc.color !== cells[payload].color &&
        !cells[payload].attacked.isFrozen.is
      ) {
        if (state.check[state.turn].is) {
          if (
            state.check[state.turn].byWhom.length > 1 &&
            cc.figure !== "king"
          ) {
            return state;
          }
          if (cc.figure !== "king") {
            return state;
          }
        }
        if (
          cc.figure === "pawn" &&
          Math.abs(state.chosenCell - payload) === 16
        ) {
          const sign = (payload - state.chosenCell) / 16;
          cells[state.chosenCell + 8 * sign].withPawnStep = true;
          state.pawnStep = {
            is: true,
            pawn: payload,
            steppedField: state.chosenCell + 8 * sign,
          };
          if (cells[state.chosenCell + 16 * sign - 1].figure) {
            attackingInfoHandler(state, state.chosenCell + 16 * sign - 1);
          }

          if (cells[state.chosenCell + 16 * sign + 1].figure) {
            attackingInfoHandler(state, state.chosenCell + 16 * sign + 1);
          }
        }
        cells[payload].figure = cc.figure;
        cells[payload].color = cc.color;
        const freezer = cc.attacks.isFreezer;
        if (freezer.is) {
          cells[freezer.target].attacked.isFrozen = {
            is: false,
            byWhom: null,
          };
        }
        if (cc.attacks.doesAttackKing) {
          const defenseSide =
            state.check[cc.color === "black" ? "white" : "black"];
          defenseSide.byWhom = defenseSide.byWhom.filter(
            (id) => id !== payload
          );
          if (defenseSide.byWhom.length === 0) {
            defenseSide.is = false;
          }
        }
        const prevCellDirectly = cc.attacked.whoIsFieldUnderAttackBy.directly;
        const currCellDirectly =
          cells[payload].attacked.whoIsFieldUnderAttackBy.directly;
        cells[state.chosenCell] = emptyCell;
        attackingInfoHandler(state, payload);
        prevCellDirectly.forEach((id) => {
          attackingInfoHandler(state, id);
        });
        currCellDirectly.forEach((id) => {
          attackingInfoHandler(state, id);
        });
        state.turn = state.turn === "white" ? "black" : "white";
      }
    },
    changeChosenCell: (state, { payload }) => {
      if (Boolean(payload)) {
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
      } else {
        state.chosenCell = null;
      }
    },
  },
});

export default boardSlice.reducer;

export const {
  getCellNewInfo,
  changeChosenCell,
  getAttackingInfo,
  moveFigure,
} = boardSlice.actions;
