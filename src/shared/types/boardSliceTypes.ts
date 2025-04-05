import type { FigureColor, FigureType } from "./chessTypes";

interface Cell {
  figure: FigureType;
  color: "black" | "white" | null;
  attacks: {
    //если да, то меняем стейт у соответствующего цвета state.black || state.white
    doesAttackKing: boolean;
    //прострел для bqr. проверять
    range: null | number[];
    //клетки, куда может походить, с учетом первого препятствия(bqr, пешки...?, для короля сразу указывать клетки не атакованные противником)
    availableCells: number[];
    isFreezer: { is: boolean; target: number; pathTowardsKing: number[] };
  };
  attacked: {
    //проверка на isFrozen будет решать, можно ли фигурой ходить
    isFrozen: { is: boolean; byWhom: number };
    whoIsFieldUnderAttackBy: {
      //надо для гайд-версии. если массив не пустой, то король туда не может ходить. при проверке достаем айди из этого массива и cells[id].attacks.range перепроверяем
      directly: number[];
      //пока что не нахожу применения этой штуке, но можно использовать для эффектов, как на личес
      through: number[];
      //необходимо для проверки этих тиммейтов после того, как сама фигура подвинется. необходимо добавлять сюда только bqr, так как только их атаки могут меняться после продвижения фигуры
      attackerColor: FigureColor[];
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
  //нужно для обнуления этого шага при ходе любой фигуры
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
