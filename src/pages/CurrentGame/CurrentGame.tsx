import { useParams } from "react-router-dom";

import {
  createSelectorTs,
  gameSettingsI,
  gamesI,
  useDispatchTs,
  useSelectorTs,
} from "@/shared";
import { Board } from "@/widgets/Board";
import parseFEN from "./helpers/parseFEN";
import styles from "./CurrentGame.module.css";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { resetBoardSlice } from "@/app";

const CurrentGame = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatchTs();

  const {
    setup,
    players: { white, black },
    timerInfo: { timer, bonus },
  } = useMemo(() => {
    return (JSON.parse(localStorage.getItem("games")) as gamesI)[
      id
    ] as gameSettingsI;
  }, []);

  const [gameTimer, setGameTimer] = useState<{ white: string; black: string }>({
    white: timer.white.join(":"),
    black: timer.black.join(":"),
  });

  const selector = useMemo(() => {
    return createSelectorTs([(state) => state.board.turn], (turn) => {
      return {
        turn,
      };
    });
  }, []);

  useLayoutEffect(() => {
    dispatch(resetBoardSlice());
  }, []);

  const { turn } = useSelectorTs(selector);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let wasBonusUsed: boolean = false;
    if (turn === null) {
    } else {
      intervalId = setInterval(() => {
        const games = JSON.parse(
          localStorage.getItem("games")
        ) as unknown as gamesI;
        const currentGame = games[id];
        const timer = currentGame.timerInfo.timer;
        let seconds = parseInt(timer[turn][1]);
        let minutes = parseInt(timer[turn][0]);
        if (timer[turn][0] === currentGame.timerInfo.startMinutes) {
          wasBonusUsed = true;
        } else {
          if (!wasBonusUsed) {
            seconds += Number(currentGame.timerInfo.bonus);
            wasBonusUsed = true;
            if (seconds >= 60) {
              minutes += 1;
              seconds = seconds - 60;
            }
          }
        }
        if (seconds === 0) {
          minutes -= 1;
          seconds = 59;
        } else {
          seconds -= 1;
        }
        const newTime = [minutes.toString(), seconds.toString()];
        localStorage.setItem(
          "games",
          JSON.stringify({
            ...games,
            [id]: {
              ...currentGame,
              timerInfo: {
                ...currentGame.timerInfo,
                timer: { ...timer, [turn]: newTime },
              },
            },
          })
        );
        if (newTime[1].length === 1) {
          newTime[1] = "0" + newTime[1];
        }
        setGameTimer((prev) => ({ ...prev, [turn]: newTime.join(":") }));
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [turn]);

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <Board setup={parseFEN(setup)} />
      </div>
      <div className={styles.info}>
        <div style={{ color: "white" }}>{gameTimer.white}</div>
        <div style={{ color: "black" }}>{gameTimer.black}</div>
      </div>
    </div>
  );
};

export default CurrentGame;
