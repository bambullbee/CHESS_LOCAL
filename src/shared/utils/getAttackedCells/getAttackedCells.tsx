import { FigureType } from "../../types/chessTypes";
import useSelectorTs from "@/shared/withTypesHooks/useSelector";

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
  } else {
    return false;
  }
};

const getAttackedCells = ({ figure, id, side }: strictProps): number[] => {
  let plusOrMinus;
  const cells = useSelectorTs((state) => state.board.cells);
  if (side === 1) {
    plusOrMinus = 1;
  } else {
    plusOrMinus = -1;
  }

  const nextRowFigure = id + plusOrMinus * 8;

  switch (figure) {
    case "pawn":
      //не стоит ли у A-H края доски пешка
      if (cells[nextRowFigure]) {
        //не стоит ли у 1-8 края доски пешка
        if (id % 8 === 0) {
          return [nextRowFigure - 1];
        }
        if (id % 8 === 7) {
          return [nextRowFigure + 1];
        }
        return [nextRowFigure - 1, nextRowFigure + 1];
      }
    case "knight":
      const res = [];
      //top
      if (cells[id - 8 * 2]) {
        if (cells[id - 8 * 2 - 1]) {
          res.push(id - 8 * 2 - 1);
        }
        if (cells[id - 8 * 2 + 1]) {
          res.push(id - 8 * 2 + 1);
        }
      }
      //bottom
      if (cells[id + 8 * 2]) {
        if (cells[id + 8 * 2 - 1]) {
          res.push(id - 8 * 2 - 1);
        }
        if (cells[id + 8 * 2 + 1]) {
          res.push(id - 8 * 2 + 1);
        }
      }
      //right
      if (isCellTheSameRow(id, id + 2)) {
        if (cells[id + 8]) {
          res.push(id + 2 + 8);
        }
        if (cells[id - 8]) {
          res.push(id + 2 - 8);
        }
      }
      //left
      if (isCellTheSameRow(id, id - 2)) {
        if (cells[id + 8]) {
          res.push(id - 2 + 8);
        }
        if (cells[id - 8]) {
          res.push(id - 2 - 8);
        }
      }
      return res;
    default:
      return [];
  }
};

export default getAttackedCells;
