import { memo, useMemo, useState } from "react";

import s from "./Cell.module.css";
import useSelectorTs from "@/shared/withTypesHooks/useSelector";
import { useDispatchTs } from "@/shared";
import { changeChosenCell } from "@/app";

interface CellP {
  row: number;
  column: number;
  id: number;
}

const Cell = ({ row, column, id }: CellP) => {
  //заменить хардкод цветов на получение цветов из стора-тема
  const squareColor = useMemo(() => {
    if (row % 2 === 0) {
      if (column % 2 === 0) {
        return "black";
      } else return "white";
    } else {
      if (column % 2 === 0) {
        return "white";
      } else {
        return "black";
      }
    }
  }, []);

  const { figure, color, isAttacked, attacks } = useSelectorTs(
    (state) => state.board.cells[id]
  );
  const chosenCell = useSelectorTs((state) => state.board.chosenCell);

  const dispatch = useDispatchTs();

  const onClick = () => {
    if (chosenCell === null) {
      dispatch(changeChosenCell(id));
    } else if (chosenCell === id) {
      dispatch(changeChosenCell(null));
    } else {
      dispatch(changeChosenCell(id));
    }
  };

  return (
    <button
      className={s.cell}
      style={{
        backgroundColor:
          chosenCell === id ? "blue" : isAttacked ? "yellow" : squareColor,
        color: color === "white" ? "pink" : "brown",
      }}
      onClick={onClick}
    >
      {row + " " + column},{figure ? figure + ", " : ""}
      {id}, {isAttacked ? "t" : "f"}, {attacks.join(" ")}
    </button>
  );
};

export default memo(Cell);

export type { CellP };
