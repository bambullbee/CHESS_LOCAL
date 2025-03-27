import { Figure } from "../Cell";

const getStartFigure = (row: number, column: number): Figure => {
  if (row === 2 || row === 7) {
    return "pawn";
  }
  if (row === 8 || row === 1) {
    if (column === 1 || column === 8) {
      return "rook";
    }
    if (column === 2 || column === 7) {
      return "knight";
    }
    if (column === 3 || column === 6) {
      return "bishop";
    }
    if (column === 4) {
      return "king";
    } else {
      return "queen";
    }
  } else {
    return null;
  }
};

export default getStartFigure;
