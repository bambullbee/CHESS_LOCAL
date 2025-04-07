import {
  FigureColor,
  FigureType,
  getStartFigure,
  initialStateI,
} from "@/shared";

const cellInfoHandler = (
  state: initialStateI,
  id: number,
  selfCreate: { figure: FigureType; colour: FigureColor }
) => {
  const cell = state.cells[id];

  const { figure, colour } = selfCreate;
  cell.figure = figure;
  cell.color = colour;
  if (figure === "king") {
    state.kingId[state.cells[id].color] = id;
  }
};

export default cellInfoHandler;
