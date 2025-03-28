import type { FigureType } from "./chessTypes";

interface Cell {
  figure: FigureType;
  color: "black" | "white" | null;
  attacks: number[];
  isAttacked: boolean;
  withPawnStep: boolean;
}

export type { Cell };
