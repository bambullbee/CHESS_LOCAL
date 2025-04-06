import type { FigureColor, FigureType } from "./chessTypes";

interface Cell {
  figure: FigureType;
  color: "black" | "white" | null;
  attacks: {
    doesAttackKing: boolean;
    //клетки, на которые могла бы походить bqr bishop queen rook через преграждающие фигуры
    range: null | number[];
    //клетки, куда фигура может походить
    availableCells: number[];
    //связывает ли bqr фигуру(за фигурой стоит король)
    isFreezer: { is: boolean; target: number };
    pathTowardsKing: number[];
  };
  attacked: {
    //связана ли фигура
    isFrozen: { is: boolean; byWhom: number };
    whoIsFieldUnderAttackBy: {
      //кем атакованы клетки. вычисляется но основе availableCells
      directly: number[];
      //кем атакованы клетки прострелом. вычисляется но основе range
      through: number[];
    };
  };
  withPawnStep: boolean;
  wasTouched: boolean;
}

interface initialStateI {
  cells: Cells;
  chosenCell: number | null;
  check: {
    black: { is: boolean; byWhom: number[] };
    white: { is: boolean; byWhom: number[] };
  };
  turn: FigureColor;
  //шаг пешки на два поля вперед
  pawnStep: {
    is: boolean;
    pawn: number;
    steppedField: number;
  };
  kingId: { black: number; white: number };
}

interface Cells {
  [key: number]: Cell;
}

interface attackerBase {
  range?: number[];
  availableCells: number[];
  frozenId?: number;
  doesAttackKing: boolean;
}

interface attackingInfo extends attackerBase {
  towardsKing?: number[];
}

interface processedLongRangeAttackers extends attackerBase {
  towardsKing: { path: number[]; isCompletedPath: boolean };
}

type handler = (
  state: Cells,
  id: number,
  resultId: number,
  shouldReturn?: boolean,
  shouldReset?: boolean
) => processedLongRangeAttackers;

export type {
  Cell,
  Cells,
  processedLongRangeAttackers,
  handler,
  initialStateI,
  attackingInfo,
};
