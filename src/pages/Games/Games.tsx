import { ReactNode, useMemo } from "react";

import {
  gameSettingsI,
  gamesI,
  shouldApplyInitialValueTypeCreator,
} from "@/shared";
import { useLocalStorage } from "@/shared";
import GameInfo from "./components/GameInfo/GameInfo";

import styles from "./Games.module.css";
import { Link } from "react-router-dom";

const Games = () => {
  const [localStorageGames, updateStorage] = useLocalStorage<gamesI>(
    "games",
    {},
    shouldApplyInitialValueTypeCreator<gamesI>()
  );
  const games = useMemo(() => {
    const gamesArray: ReactNode[] = [];
    for (let gameId in localStorageGames) {
      if (localStorageGames[gameId] as gameSettingsI) {
        const {
          players: { white, black },
          timerInfo: { timer, bonus },
          setup,
        } = (localStorageGames as gamesI)[gameId];
        gamesArray.push(
          <GameInfo
            white={white}
            black={black}
            timer={timer}
            bonus={bonus}
            gameId={gameId}
            setup={setup}
            updateStorage={updateStorage}
          />
        );
      }
    }
    return gamesArray;
  }, [localStorageGames]);
  return (
    <div>
      {games.length > 0 ? (
        games
      ) : (
        <div className={styles.empty}>
          Начатых партий нет.{" "}
          <Link className={styles.link} to="/newgame">
            Начать новую игру
          </Link>
        </div>
      )}
    </div>
  );
};

export default Games;
