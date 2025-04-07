import { baseCellInfo, pawnStepI } from "./boardSliceTypes";
import { FigureColor } from "./chessTypes";

interface gameSettingsI {
  players: { white: string; black: string };
  timerInfo: { timer: string; bonus: string };
  setup: string;
}

interface gamesI {
  [key: string]: gameSettingsI;
}

interface castling {
  black: number[];
  white: number[];
}

interface parsedFENi {
  figures: baseCellInfo[];
  turn: FigureColor;
  castling: castling;
  pawnStep: pawnStepI;
}

export { gameSettingsI, parsedFENi, castling, gamesI };
