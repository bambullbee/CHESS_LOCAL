import { useMemo, useState } from "react";

import s from "./Board.module.css";
import { Cell } from "@/entities/Cell";
import {
  createSelectorTs,
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
  const state = useSelectorTs((state) => state.board);
  const CELLS = useMemo(() => {
    return Array.from({ length: 8 }, (_, ind) => {
      return Array.from({ length: 8 }, (_, i) => {
        const id = ind * 8 + i + 1;
        return <Cell key={id} row={ind + 1} column={i + 1} id={id} />;
      });
    });
  }, []);

  return (
    <>
      <div className={s.board}>{CELLS.flat()}</div>
      <div>Check: {JSON.stringify(state.check)}</div>
      <div>PawnStep: {JSON.stringify(state.pawnStep)}</div>
      <div>KingId: {JSON.stringify(state.kingId)}</div>
      <div>Turn: {state.turn}</div>
    </>
  );
};

export default Board;

export type { cellHandler };
