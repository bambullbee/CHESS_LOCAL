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
import { changeTurn, resetBoardSlice } from "@/app";
import Timer from "./components/Timer/Timer";

const CurrentGame = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatchTs();

  const {
    setup,
    players,
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
    return createSelectorTs(
      [
        (state) => state.board.turn,
        (state) => state.board.win.condition,
        (state) => state.board.win.winner,
      ],
      (turn, winCondition, winner) => {
        return {
          turn,
          winCondition,
          winner,
        };
      }
    );
  }, []);

  useLayoutEffect(() => {
    dispatch(resetBoardSlice());
  }, []);

  const { turn, winCondition, winner } = useSelectorTs(selector);

  //IIFE использовано для замыкания
  useEffect(
    (() => {
      let isMetWithStartTimer = false;
      return () => {
        let intervalId: ReturnType<typeof setInterval>;
        let wasBonusUsed: boolean = false;
        const intervalFn = () => {
          const games = JSON.parse(
            localStorage.getItem("games")
          ) as unknown as gamesI;
          const currentGame = games[id];
          const timer = currentGame.timerInfo.timer;
          let seconds = parseInt(timer[turn][1]);
          let minutes = parseInt(timer[turn][0]);
          if (seconds === 0 && minutes === 0) {
            dispatch(changeTurn({ color: null, gameId: parseInt(id) }));
            clearInterval(intervalId);
            return;
          }
          if (
            timer[turn][0] === currentGame.timerInfo.startMinutes &&
            !isMetWithStartTimer
          ) {
            wasBonusUsed = true;
            isMetWithStartTimer = true;
          } else {
            if (!wasBonusUsed) {
              seconds += Number(bonus);
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
          const newTime = [
            minutes.toString(),
            seconds.toString().length === 1
              ? "0" + seconds.toString()
              : seconds.toString(),
          ];
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
        };
        if (turn === null) {
        } else {
          intervalFn();
          intervalId = setInterval(intervalFn, 1000);
        }
        return () => {
          clearInterval(intervalId);
        };
      };
    })(),
    [turn]
  );

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <Board setup={parseFEN(setup)} />
      </div>
      <div className={styles.info}>
        <div className={styles.timers}>
          <Timer
            name={players.white}
            time={gameTimer.white}
            isActive={"white" === turn}
          />
          <Timer
            name={players.black}
            time={gameTimer.black}
            isActive={"black" === turn}
          />
        </div>
        <div className={styles.turnOrWin}>
          {turn && <div>Ход: {players[turn]}</div>}
          {winCondition && (
            <div>{`${winCondition}. Победитель: ${winner}`}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentGame;
