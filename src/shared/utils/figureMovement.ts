import { store } from "@/app";

interface moveResults {
  kill: number;
  move: [number, number];
}

const getCellInfo = (
  row: number,
  col: number,
  id: number
): {
  isOccupied: boolean;
  color: "black" | "white";
  withPawnStep: boolean;
} => {
  const state = store.getState();
  const cellInfo = state.board.cells[id];
  return {
    isOccupied: Boolean(),
    color: cellInfo.color,
    withPawnStep: cellInfo.withPawnStep,
  };
};

const figureMovement = {
  pawn: (
    row: number,
    col: number,
    rowStart: number,
    colStart: number,
    side: 1 | 8,
    id: number
  ): moveResults => {
    //проверяем, ходит ли пешка вперед
    if (side - rowStart < side - row) {
      const diff = Math.abs(rowStart - row);
      const state = store.getState().board.rows;
      let plusOrMinus: -1 | 1 = ((rowStart - row) / diff) as -1 | 1;
      //проверяем, ходит ли пешка не более, чем на два поля вперед
      if (diff <= 2) {
        const cellInfo = getCellInfo(row, col, id);
        //проверяем, ходит ли пешка вперед
        if (col === colStart) {
          //смотрим, есть ли препятствие на ее пути
          for (let i = 1; i <= diff; i++) {
            if (cellInfo.isOccupied) {
              continue;
            } else {
              return null;
            }
          }
          return {
            kill: null,
            move: [state[rowStart][colStart], state[row][col]],
          };
          //если не вперед, то должна на одну клетку по диагонали
        } else if (Math.abs(colStart - col) === 1 && diff === 1) {
          const startFigureColor = side === 1 ? "black" : "white";
          //на этой клетке вражеская фигура?
          if (cellInfo.color !== startFigureColor) {
            return {
              kill: null,
              move: [state[rowStart][colStart], state[row][col]],
            };
            //взятие на проходе?
          } else if (cellInfo.withPawnStep) {
            return {
              kill: state[row + plusOrMinus][col],
              move: [state[rowStart][colStart], state[row][col]],
            };
          }
        }
      }
    } else {
      return null;
    }
  },
};

export default figureMovement;

export type { moveResults };
