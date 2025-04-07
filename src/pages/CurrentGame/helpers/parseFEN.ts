import { baseCellInfo, isUpperCase, parsedFENi, pawnStepI } from "@/shared";
import literalCellToId from "./literalCellToId";

interface castlingI {
  black: number[];
  white: number[];
}

const parseFEN = (FEN: string): parsedFENi => {
  const parts = FEN.split(" ");
  let preFigures = parts[0].includes("W")
    ? parts[0]
    : parts[0]
        .replace(/\//g, "")
        .replace(/\d/g, (digit) => "W".repeat(parseInt(digit, 10)));
  const figures = preFigures
    .split("")
    .reverse()
    .map((symb) => {
      const result: baseCellInfo = { figure: null, colour: null };
      const lS = symb.toLowerCase();
      if (lS === "w") {
        result.figure = null;
      }
      if (lS === "p") {
        result.figure = "pawn";
      }
      if (lS === "n") {
        result.figure = "knight";
      }
      if (lS === "b") {
        result.figure = "bishop";
      }
      if (lS === "r") {
        result.figure = "rook";
      }
      if (lS === "k") {
        result.figure = "king";
      }
      if (lS === "q") {
        result.figure = "queen";
      }

      if (symb !== "W") {
        result.colour = isUpperCase(symb) ? "white" : "black";
      }
      return result;
    });
  const turn = parts[1] === "w" ? "white" : "black";
  const castling: castlingI = {
    black: [],
    white: [],
  };
  if (parts[2] !== "-") {
    parts[2].split("").forEach((symb) => {
      if (symb === "K") {
        castling.white.push(1);
      }
      if (symb === "Q") {
        castling.white.push(8);
      }

      if (symb === "k") {
        castling.black.push(57);
      }
      if (symb === "q") {
        castling.black.push(64);
      }
    });
    if (castling.white.length > 0) {
      castling.white.push(4);
    }
    if (castling.black.length > 0) {
      castling.black.push(60);
    }
  }
  const pawnStep: pawnStepI = {
    is: false,
    pawn: null,
    steppedField: null,
  };
  if (parts[3] !== "-") {
    pawnStep.is = true;
    pawnStep.pawn = literalCellToId(parts[3] + (turn === "white" ? 8 : -8));
    pawnStep.steppedField = literalCellToId(parts[3]);
  }
  return { figures, turn, castling, pawnStep };
};

export default parseFEN;
