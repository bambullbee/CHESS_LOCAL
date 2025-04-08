import { FigureColor, gamesI, leaderboardI } from "@/shared";

const updateWinnersLocalStorage = (
  winnerColor: FigureColor,
  gameId: number
) => {
  let leaderboard = JSON.parse(
    localStorage.getItem("leaderboard")
  ) as unknown as leaderboardI;
  const games = JSON.parse(localStorage.getItem("games")) as unknown as gamesI;
  if (!leaderboard) {
    leaderboard = {};
  }
  const winnerResults = leaderboard[games[gameId].players[winnerColor]];
  leaderboard[games[gameId].players[winnerColor]] = (
    winnerResults ? parseInt(winnerResults) + 1 : 1
  ).toString();
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
};

export default updateWinnersLocalStorage;
