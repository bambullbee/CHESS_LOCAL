import { baseCellInfo, parsedFENi, pawnStepI } from "@/shared";
import literalCellToId from "./literalCellToId";

interface castlingI {
  black: number[];
  white: number[];
}

const isUpperCase = (char: string) => {
  return char === char.toUpperCase() && char !== char.toLowerCase();
};

const parseFEN = (FEN: string): parsedFENi => {
  console.log(FEN);
  const parts = FEN.split(" ");
  const figures = parts[0]
    .replace(/\//g, "")
    .replace(/\d/g, (digit) => "W".repeat(parseInt(digit, 10)))
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
    const cells = parts[3].split("-");
    pawnStep.pawn = literalCellToId(cells[1]);
    pawnStep.steppedField =
      cells.reduce((acc, cell) => {
        return acc + literalCellToId(cell);
      }, 0) / 2;
  }
  return { figures, turn, castling, pawnStep };
};

export default parseFEN;
