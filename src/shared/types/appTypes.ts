import { baseCellInfo, pawnStepI } from "./boardSliceTypes";
import { FigureColor } from "./chessTypes";

interface timerI {
  black: [string, string];
  white: [string, string];
}

interface gameSettingsI {
  players: { white: string; black: string };
  timerInfo: {
    timer: timerI;
    startMinutes: string;
    bonus: string;
  };
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

interface leaderboardI {
  [key: string]: string;
}

export { gameSettingsI, parsedFENi, castling, gamesI, leaderboardI, timerI };
