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
  };
  attacked: {
    //проверка на isFrozen будет решать, можно ли фигурой ходить
    isFrozen: boolean;
    whoIsFieldUnderAttackBy: {
      //надо для гайд-версии. если массив не пустой, то король туда не может ходить. при проверке достаем айди из этого массива и cells[id].attacks.range перепроверяем
      directly: number[];
      //пока что не нахожу применения этой штуке, но можно использовать для эффектов, как на личес
      through: number[];
      attackerColor: FigureColor[];
    };
  };
  withPawnStep: boolean;
}

interface Cells {
  [key: number]: Cell;
}

interface processedLongRangeAttackers {
  range?: number[];
  availableCells: number[];
  frozenId?: number;
  doesAttackKing: boolean;
}

type handler = (
  state: Cells,
  id: number,
  resultId: number,
  shouldReturn?: boolean,
  shouldReset?: boolean
) => processedLongRangeAttackers;

interface initialStateI {
  cells: Cells;
  chosenCell: number | null;
  check: {
    black: boolean;
    white: boolean;
  };
  turn: FigureColor;
}

export type {
  Cell,
  Cells,
  processedLongRangeAttackers,
  handler,
  initialStateI,
};
