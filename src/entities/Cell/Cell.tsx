import { memo, useEffect, useMemo, useState } from "react";

import s from "./Cell.module.css";
import useSelectorTs from "@/shared/withTypesHooks/useSelector";
import { FigureColor, FigureType, useDispatchTs } from "@/shared";
import { getCellNewInfo } from "@/app";

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

  const {
    figure,
    color,
    attacks: { availableCells },
  } = useSelectorTs((state) => state.board.cells[id]);

  const dispatch = useDispatchTs();

  useEffect(() => {
    dispatch(getCellNewInfo({ id, shouldInitialize: true }));
  }, []);

  // const onClick = () => {
  //   dispatch(changeChosenCell(id))
  // }

  return (
    <button
      className={s.cell}
      style={{
        backgroundColor: squareColor,
        color: "pink",
      }}
    >
      {id}, {figure}, {color}
    </button>
  );
};

export default memo(Cell);

export type { CellP };
