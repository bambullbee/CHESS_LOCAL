import { useMemo } from "react";

import LeaderBoardEntity from "./components/LeaderBoardEntity/LeaderBoardEntity";
import {
  leaderboardI,
  shouldApplyInitialValueTypeCreator,
  useLocalStorage,
} from "@/shared";

import styles from "./Leaderboard.module.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useLocalStorage<leaderboardI>(
    "leaderboard",
    {},
    shouldApplyInitialValueTypeCreator<leaderboardI>()
  );
  const leaderboardCells = useMemo(() => {
    const result = [];
    for (let winnerName in leaderboard) {
      if (leaderboard[winnerName]) {
        result.push(
          <LeaderBoardEntity
            name={winnerName + ":"}
            wins={leaderboard[winnerName]}
            isOdd={result.length % 2 === 0 ? true : false}
          />
        );
      }
    }
    return result;
  }, [leaderboard]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Таблица победителей</h1>
        <div className={styles.tableContainer}>
          <LeaderBoardEntity
            name={"Победители"}
            wins={"Победы"}
            isOdd={false}
          />
          {leaderboardCells.length > 0 ? (
            leaderboardCells
          ) : (
            <LeaderBoardEntity
              name={"Кто будет первым?"}
              wins={"..."}
              isOdd={false}
            />
          )}
        </div>
        <button
          className={styles.button}
          onClick={() => {
            setLeaderboard({});
          }}
          type="button"
        >
          Очистить таблицу
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
