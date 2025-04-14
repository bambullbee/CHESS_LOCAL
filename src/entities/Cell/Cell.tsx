import { memo, useEffect, useMemo } from "react";

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
  figure: FigureType;
  colour: FigureColor;
  isWithoutLogic: boolean;
}

const Cell = ({ row, column, id, colour, figure, isWithoutLogic }: CellP) => {
  const squareColor = useMemo(() => {
    if (row % 2 === 0) {
      if (column % 2 === 0) {
        return "#130d0a";
      } else return "#d3ad79";
    } else {
      if (column % 2 === 0) {
        return "#d3ad79";
      } else {
        return "#130d0a";
      }
    }
  }, []);
  let selector;
  if (!isWithoutLogic) {
    selector = useMemo(() => {
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
  }

  let currentFigure: FigureType,
    color: FigureColor,
    isChosen: boolean,
    availableToBeSteped: boolean;
  if (!isWithoutLogic) {
    const {
      currentFigure: selectorCurrentFigure,
      color: selectorColor,
      isChosen: selectorIsChosen,
      availableToBeSteped: selectorAvailableToBeSteped,
    } = useSelectorTs(selector);
    currentFigure = selectorCurrentFigure;
    color = selectorColor;
    isChosen = selectorIsChosen;
    availableToBeSteped = selectorAvailableToBeSteped;
  } else {
    color = colour;
    currentFigure = figure;
    isChosen = false;
    availableToBeSteped = false;
  }
  const dispatch = useDispatchTs();

  useEffect(() => {
    if (!isWithoutLogic) {
      dispatch(getCellNewInfo({ id, selfCreate: { colour, figure } }));
      setTimeout(() => {
        dispatch(getAttackingInfo(id));
      }, 0);
    }
  }, []);

  const gameID = useSelectorTs((state) => state.navigation.gameId);

  const onClick = () => {
    if (!isWithoutLogic) {
      if (availableToBeSteped) {
        dispatch(moveFigure({ id, gameId: parseInt(gameID) }));
        dispatch(changeChosenCell(null));
      } else {
        dispatch(changeChosenCell(id));
      }
    }
  };

  const cellFigure = useMemo(() => {
    const getColors = (color: FigureColor): figureIconColors => {
      if (color === "white") {
        return {
          firstColor: "#FFFFFF",
          secondColor: "#000000",
        };
      } else {
        return {
          firstColor: "#000000",
          secondColor: "#FFFFFF",
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
        backgroundColor: isChosen ? "rgb(244, 220, 185)" : squareColor,
      }}
      onClick={onClick}
    >
      {cellFigure}
    </button>
  );
};

export default memo(Cell);

export type { CellP };
