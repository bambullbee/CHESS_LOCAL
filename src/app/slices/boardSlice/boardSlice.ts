import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  baseCellInfo,
  castling,
  createAsyncThunkTs,
  initialStateI,
  pawnStepI,
  type Cell,
  type Cells,
  type FigureColor,
  type FigureType,
} from "@/shared";
import attackingInfoHandler from "./helpers/attackingInfoHandler";
import cellInfoHandler from "./helpers/cellInfoHandler";
import findAndDelete from "./helpers/findAndDelete";
import cleanLocalStorageGameInfo from "./helpers/cleanLocalStorageGameInfo";
import updateLocalStorageGameInfo from "./helpers/updateLocalStorageGameInfo.ts";

const CELLS: Cells = {};

const emptyCell: Cell = {
  figure: null,
  color: null,
  attacks: {
    doesAttackKing: false,
    range: [],
    availableCells: [],
    isFreezer: { is: false, target: null },
    pathTowardsKing: [],
  },
  attacked: {
    isFrozen: { is: false, byWhom: null },
    whoIsFieldUnderAttackBy: {
      directly: [],
      through: [],
    },
  },
  withPawnStep: false,
  wasTouched: true,
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
        pathTowardsKing: [],
      },
      attacked: {
        isFrozen: { is: false, byWhom: null },
        whoIsFieldUnderAttackBy: {
          directly: [],
          through: [],
        },
      },
      withPawnStep: false,
      wasTouched: true,
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

interface initializationInfoI {
  id: number;
  selfCreate: baseCellInfo;
}

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    getCellNewInfo: (
      state,
      { payload: { id, selfCreate } }: PayloadAction<initializationInfoI>
    ) => {
      cellInfoHandler(state, id, selfCreate);
    },
    getAttackingInfo: (state, { payload }: PayloadAction<number>) => {
      // if (state.cells[payload].figure === "king") {
      //   setTimeout(() => {
      //     attackingInfoHandler(state, payload);
      //   }, 0);
      // } else {
      //   attackingInfoHandler(state, payload);
      // }
      attackingInfoHandler(state, payload);
    },
    moveFigure: (state, { payload }: PayloadAction<number>) => {
      const chosenId = state.chosenCell;
      const cc = state.cells[chosenId];
      const defenseSide: FigureColor = cc.color === "black" ? "white" : "black";
      const payloadCell = state.cells[payload];
      //ход на свою клетку
      if (payload === chosenId) {
        return state;
      }
      //ход на союзную фигуру
      if (cc.color === payloadCell.color) {
        return state;
      }
      //если шах
      if (state.check[state.turn].is) {
        //при двойном шахе ходит только король
        if (state.check[state.turn].byWhom.length > 1 && cc.figure !== "king") {
          return state;
        }
        const checkerId = state.check[state.turn].byWhom[0];
        //если не король, то фигура должна закрыть короля
        if (
          cc.figure !== "king" &&
          ![
            checkerId,
            ...state.cells[checkerId].attacks.pathTowardsKing,
          ].includes(payload)
        ) {
          return state;
        }
      }
      //при связке нельзя открывать короля
      const isFrozenData = cc.attacked.isFrozen;
      if (isFrozenData.is) {
        if (
          ![
            isFrozenData.byWhom,
            ...state.cells[isFrozenData.byWhom].attacks.pathTowardsKing,
          ].includes(payload)
        ) {
          return state;
        }
      }
      if (cc.figure === "pawn") {
        //если пешка собирается бить по диагонали
        if ((chosenId - payload) % 8 !== 0) {
          //пешка не ходит по диагонали на пустое поле или поле без двойного шага пешки, но логика должна учитывать возможность пешки бить это поле
          if (
            !Boolean(payloadCell.figure) &&
            !Boolean(payloadCell.withPawnStep)
          ) {
            return state;
          }
          if (payloadCell.withPawnStep) {
            //убрать пешку
            const pawnCell = state.cells[state.pawnStep.pawn];
            state.cells[state.pawnStep.pawn] = {
              ...structuredClone(emptyCell),
              wasTouched: true,
            };
            //проверить на связку или шах целящие в нее фигуры
            pawnCell.attacked.whoIsFieldUnderAttackBy.through.forEach(
              (attackerId) => {
                if (state.cells[attackerId].color === cc.color) {
                  attackingInfoHandler(state, attackerId);
                }
              }
            );
          }
        }
      }
      //король не может ходить на аткованные поля
      if (cc.figure === "king") {
        if (
          [...payloadCell.attacked.whoIsFieldUnderAttackBy.directly]
            .filter((id) => id !== payload)
            .some((potentialAttackerId) => {
              return state.cells[potentialAttackerId].color === defenseSide;
            })
        ) {
          return state;
        }
      }
      //каждый ход сбрасывать pawnStep
      if (state.pawnStep.steppedField) {
        state.cells[state.pawnStep.steppedField].withPawnStep = false;
      }
      state.pawnStep = {
        is: false,
        pawn: null,
        steppedField: null,
      };
      //обработка двойного шага пешки и обновления информации
      if (cc.figure === "pawn" && Math.abs(chosenId - payload) === 16) {
        const sign = (payload - chosenId) / 16;
        state.cells[chosenId + 8 * sign].withPawnStep = true;
        state.pawnStep = {
          is: true,
          pawn: payload,
          steppedField: chosenId + 8 * sign,
        };
        //пешки, которые не входят в общие перепроверки, так как их "пролетели"
        if (state.cells[chosenId + 16 * sign - 1].figure) {
          attackingInfoHandler(state, chosenId + 16 * sign - 1);
        }

        if (state.cells[chosenId + 16 * sign + 1].figure) {
          attackingInfoHandler(state, chosenId + 16 * sign + 1);
        }
      }
      //логика рокировки
      if (cc.figure === "king" && Math.abs(payload - chosenId) === 2) {
        const sign = (chosenId - payload) / Math.abs(chosenId - payload);
        state.cells[payload + sign].figure = "rook";
        state.cells[payload + sign].color = cc.color;
        attackingInfoHandler(state, payload + sign);
        if (sign > 0) {
          state.cells[chosenId - 3] = {
            ...structuredClone(emptyCell),
            wasTouched: true,
          };
        }
        if (sign < 0) {
          state.cells[chosenId + 4] = {
            ...structuredClone(emptyCell),
            wasTouched: true,
          };
        }
      }

      //перенос базовой информации о фигуре на другую клетку с целью ее последующей обработки
      payloadCell.figure = cc.figure;
      payloadCell.color = cc.color;
      //удаление всех отметок о ходящей фигуре из других клеток
      const freezer = cc.attacks.isFreezer;
      if (freezer.is) {
        state.cells[freezer.target].attacked.isFrozen = {
          is: false,
          byWhom: null,
        };
      }
      findAndDelete(state, cc.attacks.availableCells, "directly", chosenId);
      findAndDelete(state, cc.attacks.range, "through", chosenId);
      //сброс информации о клекте, куда ходит фигура, из других клеток. атакующая информация у каждый фигуры своя
      findAndDelete(
        state,
        payloadCell.attacks.availableCells,
        "directly",
        payload
      );
      findAndDelete(state, payloadCell.attacks.range, "through", payload);
      //если атакованная фигура шаховала, сбросить шах
      if (payloadCell.figure) {
        state.check[cc.color].byWhom = state.check[cc.color].byWhom.filter(
          (id) => id !== payload
        );
        if (state.check[cc.color].byWhom.length === 0) {
          state.check[cc.color].is = false;
        }
      }
      //обнуляем клетку, с которой походили
      state.cells[chosenId] = {
        ...structuredClone(emptyCell),
        wasTouched: true,
      };
      //получаем информацию о поле, которое заняла фигура
      attackingInfoHandler(state, payload);
      //обновляем каждую фигуру, которая била старое поле
      cc.attacked.whoIsFieldUnderAttackBy.directly.forEach((id: number) => {
        attackingInfoHandler(state, id);
      });
      //обновляем каждую фигуру, которая била новое поле
      payloadCell.attacked.whoIsFieldUnderAttackBy.through.forEach(
        (id: number) => {
          attackingInfoHandler(state, id);
        }
      );
      if (cc.figure === "king") {
        //заморозить фигуры, которые до этого не были заморожены, но король ступил за них
        payloadCell.attacked.whoIsFieldUnderAttackBy.through.forEach(
          (attackerId) => {
            if (state.cells[attackerId].color !== cc.color) {
              attackingInfoHandler(state, attackerId);
            }
          }
        );
        //разморозить фигуры, за которыми прятался король
        cc.attacked.whoIsFieldUnderAttackBy.through.forEach((attackerId) => {
          if (state.cells[attackerId].color !== cc.color) {
            attackingInfoHandler(state, attackerId);
          }
        });
        //обновить позицию короля в globalstate
        state.kingId[cc.color] = payload;
      }
      //даем ход другой стороне
      state.turn = state.turn === "white" ? "black" : "white";
      //но также проверяем, не мат ли
      let isMate = false;
      if (state.check[defenseSide].is) {
        const kingId = state.kingId[defenseSide];
        //клетки без союзных фигур
        const availableCells = [
          ...state.cells[kingId].attacks.availableCells,
        ].filter((id) => {
          return state.cells[id].color !== defenseSide && id !== kingId;
        });
        //атакованы ли они врагом
        const isEveryCellAttacked = availableCells.every((cellId) => {
          return [
            ...state.cells[cellId].attacked.whoIsFieldUnderAttackBy.directly,
          ]
            .filter((id) => {
              if (cellId === id) {
                return id !== payload;
              } else {
                return true;
              }
            })
            .some((potentialAttackerId) => {
              return (
                state.cells[potentialAttackerId].color === payloadCell.color
              );
            });
        });
        //если двойной шах, то учитывается только то, может ли ходить король
        if (state.check[defenseSide].byWhom.length > 1) {
          if (isEveryCellAttacked) {
            isMate = true;
            state.turn = null;
          }
          //иначе учитывается еще возможность союзных фигур прикрыть короля
        } else if (
          isEveryCellAttacked &&
          ![
            state.check[defenseSide].byWhom[0],
            ...state.cells[state.check[defenseSide].byWhom[0]].attacks
              .pathTowardsKing,
          ].some((id) => {
            return state.cells[
              id
            ].attacked.whoIsFieldUnderAttackBy.directly.some(
              (potentialAllyId) =>
                state.cells[potentialAllyId].color === defenseSide &&
                potentialAllyId !== state.kingId[defenseSide]
            );
          })
        ) {
          isMate = true;
          state.turn = null;
        }
      }
      if (isMate) {
        cleanLocalStorageGameInfo();
      } else {
        //!!!2
        updateLocalStorageGameInfo(state, 2);
      }
    },
    changeChosenCell: (state, { payload }) => {
      const payloadCell = state.cells[payload];
      const chosenId = state.chosenCell;
      if (Boolean(payload)) {
        if (chosenId) {
          if (
            chosenId === payload ||
            !Boolean(payloadCell.figure) ||
            payloadCell.color !== state.turn
          ) {
            state.chosenCell = null;
          } else if (state.turn === payloadCell.color) {
            state.chosenCell = payload;
          }
        } else if (payloadCell.color === state.turn) {
          attackingInfoHandler(state, payload);
          state.chosenCell = payload;
          return state;
        }
      } else {
        state.chosenCell = null;
      }
    },
    changeTurn: (state, { payload }: PayloadAction<FigureColor>) => {
      state.turn = payload;
    },
    defineNotTouchedCells: (state, { payload }: PayloadAction<castling>) => {
      if (payload.black.length !== 0) {
        state.cells[60].wasTouched = false;
        payload.black.forEach((id) => {
          state.cells[id].wasTouched = false;
        });
      }
      if (payload.white.length !== 0) {
        state.cells[4].wasTouched = false;
        payload.white.forEach((id) => {
          state.cells[id].wasTouched = false;
        });
      }
    },
    definePawnStep: (state, { payload }: PayloadAction<pawnStepI>) => {
      state.pawnStep = payload;
    },
  },
});

export default boardSlice.reducer;

export const {
  getCellNewInfo,
  changeChosenCell,
  getAttackingInfo,
  moveFigure,
  changeTurn,
  defineNotTouchedCells,
  definePawnStep,
} = boardSlice.actions;
