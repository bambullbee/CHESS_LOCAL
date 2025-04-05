import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
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
    isFreezer: { is: false, target: null, pathTowardsKing: [] },
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
        isFreezer: { is: false, target: null, pathTowardsKing: [] },
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
  kingId: {
    black: null,
    white: null,
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
      return attackingInfoHandler(state, payload);
    },
    moveFigure: (proxyState, { payload }: PayloadAction<number>) => {
      let state = JSON.parse(
        JSON.stringify(proxyState)
      ) as unknown as initialStateI;

      const cc = JSON.parse(
        JSON.stringify(state.cells[state.chosenCell])
      ) as Cell;

      const defenseSide: FigureColor = cc.color === "black" ? "white" : "black";
      //если бьет союзную фигуру, то вычисление хода не происходит
      if (cc.color !== state.cells[payload].color) {
        //если шах тому, кто ходит...
        if (state.check[state.turn].is) {
          //если двойной шах, то ходить может только король
          if (
            state.check[state.turn].byWhom.length > 1 &&
            cc.figure !== "king"
          ) {
            return state;
          }
          //ходит не король при шахе, но ходом фигура не прикрывает короля
          if (
            cc.figure !== "king" &&
            !state.cells[
              state.check[state.turn].byWhom[0]
            ].attacks.isFreezer.pathTowardsKing.includes(payload) &&
            state.check[state.turn].byWhom[0] !== payload
          ) {
            return state;
          }
        }
        if (state.cells[state.chosenCell].attacked.isFrozen.is) {
          if (
            !state.cells[
              state.cells[state.chosenCell].attacked.isFrozen.byWhom
            ].attacks.isFreezer.pathTowardsKing.includes(payload) &&
            state.cells[state.chosenCell].attacked.isFrozen.byWhom !== payload
          ) {
            return state;
          }
        }
        if (cc.figure === "pawn") {
          if ((state.chosenCell - payload) % 8 !== 0) {
            if (
              !Boolean(state.cells[payload].figure) &&
              !Boolean(state.cells[payload].withPawnStep)
            ) {
              return state;
            }
            if (state.cells[payload].withPawnStep) {
              const pawnCell = JSON.parse(
                JSON.stringify(state.cells[state.pawnStep.pawn])
              ) as unknown as Cell;
              state.cells[state.pawnStep.pawn] = emptyCell;
              pawnCell.attacked.whoIsFieldUnderAttackBy.through.forEach(
                (attackerId) => {
                  if (
                    state.cells[attackerId].color ===
                    state.cells[state.chosenCell].color
                  ) {
                    state = attackingInfoHandler(state, attackerId);
                  }
                }
              );
            }
          }
        }

        if (state.pawnStep.steppedField) {
          state.cells[state.pawnStep.steppedField].withPawnStep = false;
        }
        state.pawnStep = {
          is: false,
          pawn: null,
          steppedField: null,
        };
        if (
          cc.figure === "pawn" &&
          Math.abs(state.chosenCell - payload) === 16
        ) {
          const sign = (payload - state.chosenCell) / 16;
          state.cells[state.chosenCell + 8 * sign].withPawnStep = true;
          state.pawnStep = {
            is: true,
            pawn: payload,
            steppedField: state.chosenCell + 8 * sign,
          };

          if (state.cells[state.chosenCell + 16 * sign - 1].figure) {
            state = attackingInfoHandler(
              state,
              state.chosenCell + 16 * sign - 1
            );
          }

          if (state.cells[state.chosenCell + 16 * sign + 1].figure) {
            state = attackingInfoHandler(
              state,
              state.chosenCell + 16 * sign + 1
            );
          }
        }
        const currCellDirectly = [
          ...state.cells[payload].attacked.whoIsFieldUnderAttackBy.directly,
        ];
        state.cells[payload].figure = cc.figure;
        state.cells[payload].color = cc.color;
        const freezer = cc.attacks.isFreezer;
        if (freezer.is) {
          state.cells[freezer.target].attacked.isFrozen = {
            is: false,
            byWhom: null,
          };
        }
        if (cc.attacks.doesAttackKing) {
          state.check[defenseSide].byWhom = state.check[
            defenseSide
          ].byWhom.filter((id: number) => id !== payload);
          if (state.check[defenseSide].byWhom.length === 0) {
            state.check[defenseSide].is = false;
          }
        }

        state.cells[state.chosenCell].attacks.availableCells.forEach((id) => {
          const index = state.cells[
            id
          ].attacked.whoIsFieldUnderAttackBy.directly.findIndex((el) => {
            return el === state.chosenCell;
          });
          if (index > -1) {
            state.cells[id].attacked.whoIsFieldUnderAttackBy.directly.splice(
              index,
              1
            );
          }
        });
        state.cells[state.chosenCell].attacks.range.forEach((id) => {
          const index = state.cells[
            id
          ].attacked.whoIsFieldUnderAttackBy.through.findIndex((el) => {
            return el === state.chosenCell;
          });
          if (index > -1) {
            state.cells[id].attacked.whoIsFieldUnderAttackBy.through.splice(
              index,
              1
            );
          }
        });

        if (state.cells[payload].figure) {
          state.check[state.cells[state.chosenCell].color].byWhom = state.check[
            state.cells[state.chosenCell].color
          ].byWhom.filter((id) => id !== payload);
          if (
            state.check[state.cells[state.chosenCell].color].byWhom.length === 0
          ) {
            state.check[state.cells[state.chosenCell].color].is = false;
          }
        }

        state.cells[state.chosenCell].attacks.range.forEach((cellId) => {
          const index = state.cells[
            cellId
          ].attacked.whoIsFieldUnderAttackBy.through.findIndex(
            (el) => el === state.chosenCell
          );
          if (index > -1) {
            state.cells[cellId].attacked.whoIsFieldUnderAttackBy.through.splice(
              index,
              1
            );
          }
        });
        state.cells[payload].attacks.availableCells.forEach((id: number) => {
          const index = state.cells[
            id
          ].attacked.whoIsFieldUnderAttackBy.directly.findIndex(
            (el) => el === payload
          );
          if (index > -1) {
            state.cells[id].attacked.whoIsFieldUnderAttackBy.directly.splice(
              index,
              1
            );
          }
          state = attackingInfoHandler(state, id);
        });
        state.cells[state.chosenCell] = emptyCell;
        state = attackingInfoHandler(state, payload);
        cc.attacked.whoIsFieldUnderAttackBy.directly.forEach((id: number) => {
          state = attackingInfoHandler(state, id);
        });

        state.turn = state.turn === "white" ? "black" : "white";
        if (cc.figure === "king") {
          state.cells[payload].attacked.whoIsFieldUnderAttackBy.through.forEach(
            (attackerId) => {
              if (state.cells[attackerId].color !== cc.color) {
                state = attackingInfoHandler(state, attackerId);
              }
            }
          );
          cc.attacked.whoIsFieldUnderAttackBy.through.forEach((attackerId) => {
            if (state.cells[attackerId].color !== cc.color) {
              state = attackingInfoHandler(state, attackerId);
            }
          });
          state.kingId[cc.color] = payload;
        }
      }

      if (state.check[defenseSide].is) {
        const availableCells = [
          ...state.cells[state.kingId[defenseSide]].attacks.availableCells,
        ].filter(
          (id) =>
            state.cells[id].color !== defenseSide &&
            id !== state.kingId[defenseSide]
        );
        //checked
        const isEveryCellAttacked = availableCells.every((cellId) => {
          return state.cells[
            cellId
          ].attacked.whoIsFieldUnderAttackBy.directly.some(
            (potentialAttackerId) => {
              return (
                state.cells[potentialAttackerId].color ===
                state.cells[payload].color
              );
            }
          );
        });
        console.log(isEveryCellAttacked, availableCells);
        if (state.check[defenseSide].byWhom.length > 1) {
          if (isEveryCellAttacked) {
            state.turn = null;
          }
        } else if (
          isEveryCellAttacked &&
          [
            state.check[defenseSide].byWhom[0],
            ...state.cells[state.check[defenseSide].byWhom[0]].attacks.isFreezer
              .pathTowardsKing,
          ].some((id) => {
            return state.cells[
              id
            ].attacked.whoIsFieldUnderAttackBy.directly.some(
              (potentialAllyId) =>
                state.cells[potentialAllyId].color === defenseSide
            );
          })
        ) {
          state.turn = null;
        }
      }
      return state;
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
          state = attackingInfoHandler(state, payload);
          state.chosenCell = payload;
          return state;
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
