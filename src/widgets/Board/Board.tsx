import { memo, useLayoutEffect, useMemo } from "react";

import s from "./Board.module.css";
import { Cell } from "@/entities/Cell";
import { parsedFENi, useDispatchTs } from "@/shared";
import { changeTurn, defineNotTouchedCells, definePawnStep } from "@/app";

type cellHandler = (row: number, col: number, id: number) => void;

interface boardI {
  setup: parsedFENi;
  isWithoutLogic?: boolean;
}

const Board = ({ setup, isWithoutLogic }: boardI) => {
  const CELLS = useMemo(() => {
    return Array.from({ length: 8 }, (_, ind) => {
      return Array.from({ length: 8 }, (_, i) => {
        const id = ind * 8 + i + 1;
        return (
          <Cell
            key={id}
            row={ind + 1}
            column={i + 1}
            id={id}
            figure={setup.figures[id - 1].figure}
            colour={setup.figures[id - 1].colour}
            isWithoutLogic={isWithoutLogic}
          />
        );
      });
    });
  }, []);

  const dispatch = useDispatchTs();

  useLayoutEffect(() => {
    dispatch(changeTurn(setup.turn));
    dispatch(defineNotTouchedCells(setup.castling));
    dispatch(definePawnStep(setup.pawnStep));
  }, []);

  return (
    <>
      <div className={s.board}>{CELLS.flat()}</div>
    </>
  );
};

export default memo(Board);

export type { cellHandler };
