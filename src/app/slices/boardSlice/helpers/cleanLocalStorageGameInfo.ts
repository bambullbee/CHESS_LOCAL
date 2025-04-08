const cleanLocalStorageGameInfo = (gameId: number) => {
  const games = JSON.parse(localStorage.getItem("games"));
  games[gameId] = undefined;
  localStorage.setItem("games", JSON.stringify(games));
};

export default cleanLocalStorageGameInfo;
