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
  state?: Cells;
}

type strictProps =
  | handlerProps
  | {
      figure: Exclude<FigureType, "pawn">;
      id: number;
      side?: null;
      state?: Cells;
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
  return logic(signsToCheckD, state, id, handler);
};

const getAttackedCells = ({
  figure,
  id,
  side,
  state: proxyState,
}: strictProps): processedLongRangeAttackers => {
  const state = (current(proxyState) as unknown as initialStateI).cells;
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
      const leftCell = state[left];
      const right = nextRowFigure + 1;
      const rightCell = state[right];
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
        if (!Boolean(state[nextRowFigure].figure)) {
          res.availableCells.push(nextRowFigure);
        }
      } else if (
        isOnBoard(doubleNextRowFigure) &&
        !Boolean(state[doubleNextRowFigure].figure)
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
      const subHandler = (key: string, value: number) => {
        availableZones[key]?.forEach((val) => {
          if (val) {
            //необходимая логика по работе с полем вся здесь
            const resultId = id + value + val;
            res.availableCells.push(resultId);
            if (state[resultId].figure === "king") {
              res.doesAttackKing = true;
            }
          }
        });
      };
      availableZones.top?.forEach((value) => {
        if (value) {
          subHandler("left", value);
          subHandler("right", value);
        }
      });
      availableZones.bottom?.forEach((value) => {
        if (value) {
          subHandler("left", value);
          subHandler("right", value);
        }
      });
      return res;
    case "bishop":
      return getDiagonalFields(id, state);
    case "rook":
      return getPerpendicularFields(id, state);
    case "queen":
      const queenD = getDiagonalFields(id, state);
      const queenP = getPerpendicularFields(id, state);
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
            state[id].color === "black" ? "white" : "black";
          if (isOnBoard(firstSummand + id)) {
            if (isCellTheSameRow(id, id + secondSummand)) {
              if (
                !state[
                  resultId
                ].attacked.whoIsFieldUnderAttackBy.attackerColor.includes(
                  potentialAttackerColor
                )
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
