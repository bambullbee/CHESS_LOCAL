import { gameSettingsI, gamesI, initialStateI } from "@/shared";

const cellIdToColumn = (id: number) => {
  let columnNumber: number;
  if (id % 8 === 0) {
    return "a";
  }
  if (id % 8 === 1) {
    return "h";
  }
  if (id % 8 === 2) {
    return "g";
  }
  if (id % 8 === 3) {
    return "f";
  }
  if (id % 8 === 4) {
    return "e";
  }
  if (id % 8 === 5) {
    return "d";
  }
  if (id % 8 === 6) {
    return "c";
  }
  if (id % 8 === 7) {
    return "b";
  }
};

const updateLocalStorageGameInfo = (state: initialStateI, id: number) => {
  const games = localStorage.getItem("games") as unknown as gamesI;
  const currentGame = games[id];
  const cells = state.cells;
  let FEN = "";
  for (let key in cells) {
    const cell = cells[key];
    if (!Boolean(cell.figure)) {
      FEN += "W";
    } else {
      let figureLetter: string;
      const figure = cell.figure;
      if (figure === "bishop") {
        figureLetter = "b";
      }
      if (figure === "king") {
        figureLetter = "k";
      }
      if (figure === "knight") {
        figureLetter = "n";
      }
      if (figure === "pawn") {
        figureLetter = "p";
      }
      if (figure === "queen") {
        figureLetter = "q";
      }
      if (figure === "rook") {
        figureLetter = "r";
      }

      if (cell.color === "white") {
        figureLetter = figureLetter.toUpperCase();
      }
      FEN += figureLetter;
    }
  }
  FEN = FEN.split("").reverse().join("");
  FEN = FEN + ` ${state.turn === "white" ? "w" : "b"} `;
  let castling = "";
  if (!cells[4].wasTouched) {
    if (!cells[1].wasTouched) {
      castling += "K";
    }
    if (!cells[8].wasTouched) {
      castling += "Q";
    }
  }
  if (!cells[60].wasTouched) {
    if (!cells[57].wasTouched) {
      castling += "k";
    }
    if (!cells[64].wasTouched) {
      castling += "q";
    }
  }
  if (castling !== "") {
    castling += " ";
  }
  FEN += castling;
  let pawnStep;
  if (!state.pawnStep.is) {
    pawnStep = "-";
  } else {
    pawnStep =
      cellIdToColumn(state.pawnStep.steppedField) +
      (state.turn === "white" ? "6" : "3");
  }
  FEN += pawnStep;
  FEN += " 0 0";
  localStorage.setItem(
    "games",
    JSON.stringify({
      ...games,
      [id.toString()]: { ...currentGame, setup: FEN },
    })
  );
  return FEN;
};

export default updateLocalStorageGameInfo;
