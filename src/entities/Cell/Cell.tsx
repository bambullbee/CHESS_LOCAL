import { memo, useEffect, useMemo, useState } from "react";

import s from "./Cell.module.css";
import useSelectorTs from "@/shared/withTypesHooks/useSelector";
import {
  createSelectorTs,
  FigureColor,
  FigureType,
  useDispatchTs,
} from "@/shared";
import { changeChosenCell, getAttackingInfo, getCellNewInfo } from "@/app";

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

  const selector = useMemo(() => {
    return createSelectorTs(
      [
        (state) => state.board.cells[id].figure,
        (state) => state.board.cells[id].color,
        (state) => state.board.chosenCell === id,
        (state) => {
          if (state.board.cells[state.board.chosenCell]) {
            return state.board.cells[
              state.board.chosenCell
            ].attacks.availableCells.includes(id);
          }
          return false;
        },
      ],
      (figure, color, isChosen, availableToBeSteped) => ({
        figure,
        color,
        isChosen,
        availableToBeSteped,
      })
    );
  }, []);

  const { figure, color, isChosen, availableToBeSteped } =
    useSelectorTs(selector);

  const dispatch = useDispatchTs();

  useEffect(() => {
    dispatch(getCellNewInfo({ id, shouldInitialize: true }));
    setTimeout(() => {
      dispatch(getAttackingInfo(id));
    }, 0);
  }, []);

  const onClick = () => {
    dispatch(changeChosenCell(id));
  };

  console.log(id);

  return (
    <button
      className={s.cell}
      style={{
        backgroundColor: isChosen
          ? "blue"
          : availableToBeSteped
          ? "yellow"
          : squareColor,
        color: "pink",
      }}
      onClick={onClick}
    >
      {id}, {figure}, {color}
    </button>
  );
};

export default memo(Cell);

export type { CellP };
