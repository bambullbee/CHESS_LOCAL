import { useMemo, useState } from "react";

import s from "./Board.module.css";
import { Cell } from "@/entities/Cell";
import {
  FigureColor,
  FigureType,
  useDispatchTs,
  useSelectorTs,
} from "@/shared";

type cellHandler = (row: number, col: number, id: number) => void;

interface chosenCell {
  row: number;
  col: number;
  id: number;
  figure: FigureType;
}

const Board = () => {
  const cells = useSelectorTs((state) => state.board.cells);

  const CELLS = useMemo(() => {
    return Array.from({ length: 8 }, (_, ind) => {
      return Array.from({ length: 8 }, (_, i) => {
        return (
          <Cell
            key={ind * 8 + i + 1}
            row={ind + 1}
            column={i + 1}
            id={ind * 8 + i + 1}
          />
        );
      });
    });
  }, []);

  return <div className={s.board}>{CELLS.flat()}</div>;
};

export default Board;

export type { cellHandler };
