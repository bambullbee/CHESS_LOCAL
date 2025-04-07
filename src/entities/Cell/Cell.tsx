import { memo, useEffect, useMemo, useState } from "react";

import s from "./Cell.module.css";
import useSelectorTs from "@/shared/withTypesHooks/useSelector";
import {
  Bishop,
  createSelectorTs,
  FigureColor,
  figureIconColors,
  FigureType,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
  useDispatchTs,
} from "@/shared";
import {
  changeChosenCell,
  getAttackingInfo,
  getCellNewInfo,
  moveFigure,
} from "@/app";
import { current } from "@reduxjs/toolkit";

interface CellP {
  row: number;
  column: number;
  id: number;
  figure: FigureType;
  colour: FigureColor;
}

const Cell = ({ row, column, id, colour, figure }: CellP) => {
  const shouldShowInfo = false;
  //заменить хардкод цветов на получение цветов из стора-тема
  const squareColor = useMemo(() => {
    if (row % 2 === 0) {
      if (column % 2 === 0) {
        return "rgb(146, 168, 174)";
      } else return "rgb(176, 202, 209)";
    } else {
      if (column % 2 === 0) {
        return "rgb(176, 202, 209)";
      } else {
        return "rgb(146, 168, 174)";
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
        currentFigure: figure,
        color,
        isChosen,
        availableToBeSteped,
      })
    );
  }, []);

  const { currentFigure, color, isChosen, availableToBeSteped } =
    useSelectorTs(selector);
  console.log(id, colour, figure);
  const dispatch = useDispatchTs();

  useEffect(() => {
    dispatch(getCellNewInfo({ id, selfCreate: { colour, figure } }));
    setTimeout(() => {
      dispatch(getAttackingInfo(id));
    }, 0);
  }, []);

  const onClick = () => {
    if (availableToBeSteped) {
      dispatch(moveFigure(id));
      dispatch(changeChosenCell(null));
    } else {
      dispatch(changeChosenCell(id));
    }
  };

  const cellFigure = useMemo(() => {
    const getColors = (color: FigureColor): figureIconColors => {
      if (color === "white") {
        return {
          firstColor: "#D5D5D5",
          secondColor: "#FFFBFB",
          thirdColor: "#FFFFFF",
          borderColor: "#000000",
        };
      } else {
        return {
          firstColor: "#555555",
          secondColor: "#424242",
          thirdColor: "#000000",
          borderColor: "#FFFFFF",
        };
      }
    };
    const res = getColors(color);
    switch (currentFigure) {
      case "pawn":
        return <Pawn {...res} />;
      case "knight":
        return <Knight {...res} />;
      case "bishop":
        return <Bishop {...res} />;
      case "queen":
        return <Queen {...res} />;
      case "rook":
        return <Rook {...res} />;
      case "king":
        return <King {...res} />;
      default:
        return "";
    }
  }, [currentFigure, color]);

  return (
    <button
      className={s.cell}
      style={{
        backgroundColor: isChosen
          ? "blue"
          : availableToBeSteped
          ? "yellow"
          : squareColor,
        color: currentFigure ? (color === "white" ? "white" : "black") : "pink",
      }}
      onClick={onClick}
    >
      {cellFigure}
    </button>
  );
};

export default memo(Cell);

export type { CellP };
