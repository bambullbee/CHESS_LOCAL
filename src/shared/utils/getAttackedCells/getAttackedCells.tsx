import { Cells } from "@/shared";
import { FigureType } from "../../types/chessTypes";
import { current } from "@reduxjs/toolkit";

import {
  processedLongRangeAttackers,
  handler,
  Cell,
  initialStateI,
  attackingInfo,
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
}: strictProps): attackingInfo => {
  const state = JSON.parse(JSON.stringify(proxyState));
  let plusOrMinus;
  if (side === 1) {
    plusOrMinus = 1;
  } else {
    plusOrMinus = -1;
  }
  const res: attackingInfo = {
    availableCells: [],
    doesAttackKing: false,
    towardsKing: [],
    range: [],
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
        if (cell.figure === "king") {
          return { id, is: true };
        }
        return { id, is: false };
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
          {
            const { id, is } = handler(leftCell, left);
            res.availableCells.push(id);
            res.doesAttackKing = is;
          }
          {
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
        !Boolean(state.cells[doubleNextRowFigure].figure) &&
        !isOnBoard(id + plusOrMinus * 16 * -1)
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
            const resultId = id + value + val;
            res.availableCells.push(resultId);
            if (
              state.cells[resultId].figure === "king" &&
              state.cells[resultId].color !== state.cells[id].color
            ) {
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
    case "bishop": {
      const { availableCells, range, frozenId, doesAttackKing, towardsKing } =
        getDiagonalFields(id, state.cells);
      return {
        availableCells,
        range,
        frozenId,
        doesAttackKing,
        towardsKing: towardsKing.path,
      };
    }
    case "rook": {
      const { availableCells, range, frozenId, doesAttackKing, towardsKing } =
        getPerpendicularFields(id, state.cells);
      return {
        availableCells,
        range,
        frozenId,
        doesAttackKing,
        towardsKing: towardsKing.path,
      };
    }
    case "queen":
      const queenD = getDiagonalFields(id, state.cells);
      const queenP = getPerpendicularFields(id, state.cells);

      return {
        availableCells: queenD.availableCells.concat(queenP.availableCells),
        range: queenD.range.concat(queenP.range),
        frozenId: queenD.frozenId || queenP.frozenId,
        doesAttackKing: queenD.doesAttackKing || queenP.doesAttackKing,
        towardsKing:
          (queenD.towardsKing.isCompletedPath
            ? queenD.towardsKing.path
            : null) ||
          (queenP.towardsKing.isCompletedPath
            ? queenP.towardsKing.path
            : null) ||
          [],
      };
    case "king":
      const potentialAttackerColor =
        state.cells[id].color === "black" ? "white" : "black";
      res.availableCells = extendedSignsToCheck
        .map((signs: [number, number]) => {
          const firstSummand = signs[0] * 8;
          const secondSummand = signs[1] * 1;
          const resultId = id + firstSummand + secondSummand;
          if (isOnBoard(firstSummand + id)) {
            if (isCellTheSameRow(id, id + secondSummand)) {
              if (
                state.cells[
                  resultId
                ].attacked.whoIsFieldUnderAttackBy.directly.every(
                  (attackerId: number) => {
                    return (
                      state.cells[attackerId].color !== potentialAttackerColor
                    );
                  }
                )
              ) {
                return resultId;
              }
            }
          }
        })
        .filter((id) => id !== 0);

      if (!state.cells[id].wasTouched) {
        const rooks = [id - 3, id + 4];
        const resRooks = rooks.filter((rookId) => {
          const rookIsReady =
            state.cells[rookId].figure === "rook" &&
            state.cells[rookId].color === state.cells[id].color &&
            !state.cells[rookId].wasTouched;
          let cellsToCheck: number[] = [];
          let shouldCheck: boolean = true;
          let sign = (id - rookId) / Math.abs(id - rookId);
          for (let i = 1; i !== Math.abs(id - rookId); i++) {
            if (shouldCheck) {
              const cell = state.cells[rookId + sign * i];
              if (
                !cell.figure &&
                cell.attacked.whoIsFieldUnderAttackBy.directly.every(
                  (attacker: number) =>
                    state.cells[attacker].color !== potentialAttackerColor
                )
              ) {
                console.log(rookId, rookId + sign * i);
                cellsToCheck.push(rookId + sign * i);
              } else {
                shouldCheck = false;
                break;
              }
            }
          }
          return rookIsReady && shouldCheck;
        });
        resRooks.forEach((rookId) => {
          res.availableCells.push(rookId > id ? id + 2 : id - 2);
        });
      }
      return res;
  }
};

export default getAttackedCells;

export { getDiagonalFields };
