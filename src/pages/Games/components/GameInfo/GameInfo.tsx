import styles from "./GameInfo.module.css";
import { Board } from "@/widgets/Board";
import parseFEN from "@/pages/CurrentGame/helpers/parseFEN";
import { gamesI, timerI, useDispatchTs } from "@/shared";
import { changePage, chooseGame } from "@/app";

interface gameInfoI {
  white: string;
  black: string;
  timer: timerI;
  bonus: string;
  gameId: string;
  setup: string;
  updateStorage: (newValue: gamesI) => void;
}

const GameInfo = ({
  white,
  black,
  timer,
  bonus,
  gameId,
  setup,
  updateStorage,
}: gameInfoI) => {
  const dispatch = useDispatchTs();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.board}>
          <Board setup={parseFEN(setup)} isWithoutLogic />
        </div>
        <div className={styles.info}>
          <div>За белых играет: {white}</div>
          <div>За черных играет: {black}</div>
          <div>
            Оставшееся время белых:{" "}
            {timer.white[0] +
              ":" +
              (timer.white[1] === "0" ? "00" : timer.white[1])}
          </div>
          <div>
            Оставшееся время черных:{" "}
            {timer.black[0] +
              ":" +
              (timer.black[1] === "0" ? "00" : timer.black[1])}
          </div>
          <div>Бонусное время: {bonus}</div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.linkWrapper}
            onClick={() => {
              dispatch(chooseGame(gameId));
              dispatch(changePage("game"));
            }}
          >
            <div className={styles.link}>Перейти к игре</div>
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => {
              const games = JSON.parse(
                localStorage.getItem("games")
              ) as unknown as gamesI;
              games[gameId] = undefined;
              updateStorage(games);
            }}
          >
            Удалить игру
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
