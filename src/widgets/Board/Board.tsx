import { useMemo, useState } from "react";

import s from "./Board.module.css";
import { Cell } from "@/entities/Cell";
import { FigureType } from "@/shared";
import useSelectorTs from "@/shared/withTypesHooks/useSelector";

type cellHandler = (row: number, col: number, id: number) => void;

interface chosenCell {
  row: number;
  col: number;
  id: number;
  figure: FigureType;
}

const Board = () => {
  const getCellInfo = (row: number, col: number, id: number): chosenCell => {
    return {
      row,
      col,
      id,
      figure: useSelectorTs(
        (state) => state.board.cells[state.board.rows[row][col]].figure
      ),
    };
  };

  const [firstChosenCell, setFirstChosenCell] = useState<chosenCell>(null);
  const [secondChosenCell, setSecondChosenCell] = useState<chosenCell>(null);

  const onClick: cellHandler = (row, col, id) => {
    if (firstChosenCell) {
      setSecondChosenCell(getCellInfo(row, col, id));
      if (
        secondChosenCell.row === firstChosenCell.row &&
        secondChosenCell.col === firstChosenCell.col
      ) {
        setFirstChosenCell(null), setSecondChosenCell(null);
        return;
      } else {
      }
    } else {
      setFirstChosenCell(getCellInfo(row, col, id));
    }
  };

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
