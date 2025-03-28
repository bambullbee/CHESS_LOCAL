import { FigureType } from "../../types/chessTypes";

interface handlerProps {
  figure: "pawn";
  id: number;
  side: 1 | 8;
}

type strictProps =
  | handlerProps
  | { figure: Exclude<FigureType, "pawn">; id: number; side?: null };

const isCellTheSameRow = (idFirst: number, idSecond: number): boolean => {
  if (Math.ceil(idFirst / 8) === Math.ceil(idSecond / 8)) {
    return true;
  }
  return false;
};

const isNumberInRange = (start: number, end: number) => {
  return (id: number) => {
    return start < id && id < end;
  };
};

const isOnBoard = isNumberInRange(0, 64);

const rangeToCheck = [1, 2, 3, 4, 5, 6, 7, 8];

const signsToCheck = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const extendedSignsToCheck = signsToCheck.concat([
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]);

const getDiagonalFields = (id: number): number[] => {
  const res: number[] = [];
  signsToCheck.forEach((signs) => {
    rangeToCheck.forEach((range) => {
      const sameColDiffRow = id + signs[0] * range * 8;
      const resultId = sameColDiffRow + signs[1] * range;
      if (isOnBoard(sameColDiffRow)) {
        if (isCellTheSameRow(sameColDiffRow, resultId)) {
          res.push(resultId);
        }
      }
    });
  });
  return res;
};

const getPerpendicularFields = (id: number): number[] => {
  const res: number[] = [];
  let startRowId: number;
  if (id % 8 !== 0) {
    startRowId = id % 8;
  } else {
    startRowId = 8;
  }
  let startColId: number;
  if (id % 8 !== 0) {
    startColId = Math.floor(id / 8) * 8 + 1;
  } else {
    startColId = Math.floor((id - 1) / 8) * 8 + 1;
  }

  rangeToCheck.forEach((range) => {
    const inNewRow = startRowId + 8 * (range - 1);
    if (inNewRow !== id) {
      res.push(inNewRow);
    }
    const inNewCol = startColId + 1 * (range - 1);
    if (inNewCol !== id) {
      res.push(inNewCol);
    }
  });

  return res;
};

const getAttackedCells = ({ figure, id, side }: strictProps): number[] => {
  let plusOrMinus;
  if (side === 1) {
    plusOrMinus = 1;
  } else {
    plusOrMinus = -1;
  }

  const nextRowFigure = id + plusOrMinus * 8;

  switch (figure) {
    case "pawn":
      if (isOnBoard(nextRowFigure)) {
        if (id % 8 === 0) {
          return [nextRowFigure - 1];
        }

        if (id % 8 === 1) {
          return [nextRowFigure + 1];
        }

        return [nextRowFigure - 1, nextRowFigure + 1];
      }
    case "knight":
      const res = [];

      if (isOnBoard(id - 8 * 2)) {
        if (isCellTheSameRow(id, id - 1)) {
          res.push(id - 8 * 2 - 1);
        }

        if (isCellTheSameRow(id, id + 1)) {
          res.push(id - 8 * 2 + 1);
        }
      }
      if (isOnBoard(id + 8 * 2)) {
        if (isCellTheSameRow(id, id - 1)) {
          res.push(id + 8 * 2 - 1);
        }

        if (isCellTheSameRow(id, id + 1)) {
          res.push(id + 8 * 2 + 1);
        }
      }
      if (isCellTheSameRow(id, id + 2)) {
        if (isOnBoard(id + 8)) {
          res.push(id + 2 + 8);
        }

        if (isOnBoard(id - 8)) {
          res.push(id + 2 - 8);
        }
      }
      if (isCellTheSameRow(id, id - 2)) {
        if (isOnBoard(id + 8)) {
          res.push(id - 2 + 8);
        }

        if (isOnBoard(id - 8)) {
          res.push(id - 2 - 8);
        }
      }
      return res;
    case "bishop":
      return getDiagonalFields(id);
    case "rook":
      return getPerpendicularFields(id);
    case "queen":
      return getDiagonalFields(id).concat(getPerpendicularFields(id));
    case "king":
      return extendedSignsToCheck
        .map((signs: [number, number]) => {
          const firstSummand = signs[0] * 8;
          const secondSummand = signs[1] * 1;
          if (isOnBoard(firstSummand + id)) {
            if (isCellTheSameRow(id, id + secondSummand)) {
              return id + firstSummand + secondSummand;
            }
          }
          return [];
        })
        .flat();
    default:
      return [];
  }
};

export default getAttackedCells;
