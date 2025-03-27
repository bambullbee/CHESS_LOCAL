import React, { Dispatch, useMemo } from "react";

import s from "./Board.module.css";

import { Cell } from "@/entities/Cell";
import { Figure } from "@/entities/Cell";
import useSelectorTs from "@/shared/withTypesHooks/useSelector";

type cellHandler = (
  row: number,
  col: number,
  setFigure: Dispatch<Figure>
) => () => void;

interface chosenCell {
  row: number;
  col: number;
  figure: Figure;
}

const Board = () => {
  const getCellInfo = (row: number, col: number): chosenCell => {
    return {
      row,
      col,
      figure: useSelectorTs(
        (state) => state.board.cells[state.board.rows[row][col]].figure
      ),
    };
  };

  const handleClick: cellHandler = (row, col, setFigure) => {
    let firstCell: chosenCell = null;
    let secondCell: chosenCell = null;
    return () => {
      if (firstCell) {
        if (
          secondCell.row === firstCell.row &&
          secondCell.col === firstCell.col
        ) {
          //логика по снятию фокуса с обеих фигур
        } else {
        }
      } else {
        firstCell = getCellInfo(row, col);
      }
    };
  };

  const CELLS = useMemo(() => {
    return Array.from({ length: 8 }, (_, ind) => {
      return Array.from({ length: 8 }, (_, i) => {
        return <Cell row={ind + 1} column={i + 1} onClick={handleClick} />;
      });
    }).reverse();
  }, []);

  return <div className={s.board}>{CELLS}</div>;
};

export default Board;

export type { cellHandler };
