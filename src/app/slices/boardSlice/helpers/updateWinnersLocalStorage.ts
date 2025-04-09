import {
  FigureColor,
  gamesI,
  initialStateI,
  leaderboardI,
  winConditionT,
} from "@/shared";

const updateWinnersLocalStorage = (
  winnerColor: FigureColor,
  gameId: number,
  winnerCondition: winConditionT,
  state: initialStateI
) => {
  let leaderboard = JSON.parse(
    localStorage.getItem("leaderboard")
  ) as unknown as leaderboardI;
  const games = JSON.parse(localStorage.getItem("games")) as unknown as gamesI;
  if (!leaderboard) {
    leaderboard = {};
  }
  const winnerName = games[gameId].players[winnerColor];
  state.win = { condition: winnerCondition, winner: winnerName };
  const winnerResults = leaderboard[winnerName];
  leaderboard[games[gameId].players[winnerColor]] = (
    winnerResults ? parseInt(winnerResults) + 1 : 1
  ).toString();
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
};

export default updateWinnersLocalStorage;
