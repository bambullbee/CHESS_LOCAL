import { useMemo, useState } from "react";

import s from "./Cell.module.css";
import getStartFigure from "./helpers/getStartFigure";
import { cellHandler } from "@/widgets/Board/Board";

interface CellP {
  row: number;
  column: number;
  onClick: cellHandler;
}

type Figure = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

const Cell = ({ row, column, onClick }: CellP) => {
  //заменить хардкод цветов на получение цветов из стора-тема
  const color = useMemo(() => {
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

  const [figure, setFigure] = useState<Figure>(getStartFigure(row, column));

  return (
    <button
      className={s.cell}
      style={{ backgroundColor: color }}
      onClick={(e) => {
        onClick;
      }}
    >
      {figure === "pawn" ? (
        <svg
          height="100%"
          viewBox="0 0 2 3"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <ellipse cx="1" cy="2.8" rx="0.4" ry="0.15" fill="#333" />
          <path d="M0.8 2.8 Q1 1.5 1.2 2.8 Z" fill="#555" />
          <ellipse cx="1" cy="1.5" rx="0.25" ry="0.15" fill="#666" />
          <ellipse
            cx="1"
            cy="1.7"
            rx="0.2"
            ry="0.05"
            fill="none"
            stroke="#aaa"
            stroke-width="0.02"
          />
          <circle cx="1" cy="1.4" r="0.08" fill="#777" />
        </svg>
      ) : (
        figure
      )}
    </button>
  );
};

export default Cell;

export type { CellP, Figure };
