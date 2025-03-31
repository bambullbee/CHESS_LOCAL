import { Cells } from "@/shared";
import { FigureType } from "../../types/chessTypes";
import { current } from "@reduxjs/toolkit";

import {
  processedLongRangeAttackers,
  handler,
  Cell,
  initialStateI,
} from "../../types/boardSliceTypes";

import getDiversedResults from "./helpers/getDiversedResults";
import logic from "./helpers/bqrLogic";
import { isOnBoard, isCellTheSameRow } from "./helpers/bqrLogic";

interface handlerProps {
  figure: "pawn";
  id: number;
  side: 1 | 8;
  state?: initialStateI;
}

type strictProps =
  | handlerProps
  | {
      figure: Exclude<FigureType, "pawn">;
      id: number;
      side?: null;
      state?: initialStateI;
    };

const signsToCheckD: [number, number][] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const signsToCheckP: [number, number][] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const extendedSignsToCheck = signsToCheckD.concat(signsToCheckP);

const getDiagonalFields = (
  id: number,
  state: Cells = null
): processedLongRangeAttackers => {
  const handler = getDiversedResults();
  return logic(signsToCheckD, state, id, handler);
};

const getPerpendicularFields = (
  id: number,
  state: Cells = null
): processedLongRangeAttackers => {
  const handler = getDiversedResults();
  return logic(signsToCheckP, state, id, handler);
};

const getAttackedCells = ({
  figure,
  id,
  side,
  state: proxyState,
}: strictProps): processedLongRangeAttackers => {
  const state = current(proxyState) as unknown as initialStateI;
  let plusOrMinus;
  if (side === 1) {
    plusOrMinus = 1;
  } else {
    plusOrMinus = -1;
  }
  const res: processedLongRangeAttackers = {
    availableCells: [],
    doesAttackKing: false,
  };

  switch (figure) {
    case "pawn":
      const nextRowFigure = id + plusOrMinus * 8;
      const doubleNextRowFigure = nextRowFigure + plusOrMinus * 8;
      const left = nextRowFigure - 1;
      const leftCell: Cell = state.cells[left];
      const right = nextRowFigure + 1;
      const rightCell: Cell = state.cells[right];
      const handler = (cell: Cell, id: number) => {
        if (cell.figure || cell.withPawnStep) {
          if (cell.figure === "king") {
            return { id, is: true };
          }
          return { id, is: false };
        } else {
          return { id: null, is: false };
        }
      };
      if (isOnBoard(nextRowFigure)) {
        if (id % 8 === 0) {
          const { id, is } = handler(leftCell, left);
          res.availableCells.push(id);
          res.doesAttackKing = is;
        } else if (id % 8 === 1) {
          const { id, is } = handler(rightCell, right);
          res.availableCells.push(id);
          res.doesAttackKing = is;
        } else {
          if (leftCell.figure || leftCell.withPawnStep) {
            const { id, is } = handler(leftCell, left);
            res.availableCells.push(id);
            res.doesAttackKing = is;
          }
          if (rightCell.figure || rightCell.withPawnStep) {
            const { id, is } = handler(rightCell, right);
            res.availableCells.push(id);
            res.doesAttackKing = is;
          }
        }
        if (!Boolean(state.cells[nextRowFigure].figure)) {
          res.availableCells.push(nextRowFigure);
        }
      }
      if (
        isOnBoard(doubleNextRowFigure) &&
        !Boolean(state.cells[doubleNextRowFigure].figure)
      ) {
        res.availableCells.push(doubleNextRowFigure);
      }
      res.availableCells = res.availableCells.filter((el) => el);

      return res;
    case "knight":
      const availableZones: { [key: string]: number[] } = {
        top: isOnBoard(id - 8 * 2)
          ? [-16, -8]
          : isOnBoard(id - 8)
          ? [-8]
          : null,
        left: isCellTheSameRow(id, id - 2)
          ? [-2, -1]
          : isCellTheSameRow(id, id - 1)
          ? [-1]
          : null,
        right: isCellTheSameRow(id, id + 2)
          ? [2, 1]
          : isCellTheSameRow(id, id + 1)
          ? [1]
          : null,
        bottom: isOnBoard(id + 8 * 2)
          ? [16, 8]
          : isOnBoard(id + 8)
          ? [8]
          : null,
      };
      const subHandler = (key: string, value: number, isTop: boolean) => {
        availableZones[key]?.forEach((val) => {
          const isSubTop: boolean = Math.abs(val) === 2;
          if (val && isTop !== isSubTop) {
            //необходимая логика по работе с полем вся здесь
            const resultId = id + value + val;
            res.availableCells.push(resultId);
            if (state.cells[resultId].figure === "king") {
              res.doesAttackKing = true;
            }
          }
        });
      };
      availableZones.top?.forEach((value) => {
        const isTop = Math.abs(value) === 16;
        if (value) {
          subHandler("left", value, isTop);
          subHandler("right", value, isTop);
        }
      });
      availableZones.bottom?.forEach((value) => {
        const isTop = Math.abs(value) === 16;
        if (value) {
          subHandler("left", value, isTop);
          subHandler("right", value, isTop);
        }
      });
      return res;
    case "bishop":
      return getDiagonalFields(id, state.cells);
    case "rook":
      return getPerpendicularFields(id, state.cells);
    case "queen":
      const queenD = getDiagonalFields(id, state.cells);
      const queenP = getPerpendicularFields(id, state.cells);
      return {
        availableCells: queenD.availableCells.concat(queenP.availableCells),
        range: queenD.range.concat(queenP.range),
        frozenId: queenD.frozenId || queenP.frozenId,
        doesAttackKing: queenD.doesAttackKing || queenP.doesAttackKing,
      };
    case "king":
      res.availableCells = extendedSignsToCheck
        .map((signs: [number, number]) => {
          const firstSummand = signs[0] * 8;
          const secondSummand = signs[1] * 1;
          const resultId = id + firstSummand + secondSummand;
          const potentialAttackerColor =
            state.cells[id].color === "black" ? "white" : "black";
          if (isOnBoard(firstSummand + id)) {
            if (isCellTheSameRow(id, id + secondSummand)) {
              if (
                !state.cells[
                  resultId
                ].attacked.whoIsFieldUnderAttackBy.attackerColor.includes(
                  potentialAttackerColor
                ) &&
                state.cells[resultId].color !== state.cells[id].color
              ) {
                return resultId;
              }
            }
          }
        })
        .filter((id) => id !== 0);
      return res;
  }
};

export default getAttackedCells;

export { getDiagonalFields };
