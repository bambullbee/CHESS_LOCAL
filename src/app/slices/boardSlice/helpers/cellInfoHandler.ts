import {
  FigureColor,
  FigureType,
  getStartFigure,
  initialStateI,
} from "@/shared";

const cellInfoHandler = (
  state: initialStateI,
  id: number,
  shouldInitialize: boolean,
  selfCreate: { figure?: FigureType; colour?: FigureColor }
) => {
  const cell = state.cells[id];
  let startFigure: FigureType = cell.figure;
  let color: FigureColor = cell.color;
  if (shouldInitialize) {
    const res = getStartFigure(id);
    startFigure = res.startFigure;
    color = res.color;
  }
  if (selfCreate) {
    const { figure, colour } = selfCreate;
    startFigure = figure;
    color = colour;
  }
  cell.figure = startFigure;
  cell.color = color;
  if (state.cells[id].figure === "king") {
    state.kingId[state.cells[id].color] = id;
  }
};

export default cellInfoHandler;
