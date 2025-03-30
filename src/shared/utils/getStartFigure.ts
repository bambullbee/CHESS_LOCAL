import { FigureColor, type FigureType } from "@/shared";

interface res {
  startFigure: FigureType;
  color: FigureColor;
}

const getStartFigure = (id: number): res => {
  const res: res = { startFigure: null, color: null };

  let row = Math.ceil(id / 8);

  if (row === 0) {
    row = 1;
  }

  let column = id % 8;

  if (column === 0) {
    column = 8;
  }

  if (row === 2 || row === 7) {
    res.startFigure = "pawn";
  }

  if (row === 8 || row === 1) {
    if (column === 1 || column === 8) {
      res.startFigure = "rook";
    }

    if (column === 2 || column === 7) {
      res.startFigure = "knight";
    }

    if (column === 3 || column === 6) {
      res.startFigure = "bishop";
    }

    if (column === 4) {
      res.startFigure = "king";
    }

    if (column === 5) {
      res.startFigure = "queen";
    }
  }
  if (res.startFigure) {
    res.color = row < 3 ? "white" : row > 6 ? "black" : null;
  }
  return res;
};

export default getStartFigure;
