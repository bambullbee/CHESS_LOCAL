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
        (state) =>
          state.board.cells[id].attacked.whoIsFieldUnderAttackBy.directly,
        (state) => {
          return state.board.cells[id].attacked.isFrozen;
        },
        (state) => state.board.cells[id].withPawnStep,
        (state) => state.board.cells[id].attacked.isFrozen.byWhom,
      ],
      (
        figure,
        color,
        isChosen,
        availableToBeSteped,
        whoIsFieldUnderAttackBy,
        isFrozen,
        withPawnStep,
        byWhom
      ) => ({
        figure,
        color,
        isChosen,
        availableToBeSteped,
        whoIsFieldUnderAttackBy,
        isFrozen,
        withPawnStep,
        byWhom,
      })
    );
  }, []);

  const {
    figure,
    color,
    isChosen,
    availableToBeSteped,
    isFrozen,
    withPawnStep,
    byWhom,
  } = useSelectorTs(selector);

  const dispatch = useDispatchTs();

  useEffect(() => {
    dispatch(getCellNewInfo({ id, shouldInitialize: true }));
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
    switch (figure) {
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
  }, [figure, color]);

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
      {figure + " " + color}, isCh: {isChosen ? "tr" : "fa"}, isFr:
      {isFrozen ? "tr" : "fa"}, byWh: {byWhom}
    </button>
  );
};

export default memo(Cell);

export type { CellP };
