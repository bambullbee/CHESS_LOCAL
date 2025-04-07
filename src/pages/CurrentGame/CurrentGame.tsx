import { useParams } from "react-router-dom";

import {
  createSelectorTs,
  gameSettingsI,
  gamesI,
  useDispatchTs,
  useSelectorTs,
} from "@/shared";
import { Board } from "@/widgets/Board";
import parseFEN from "@/widgets/Board/helpers/parseFEN";
import styles from "./CurrentGame.module.css";
import { useLayoutEffect, useMemo } from "react";
import { changeTurn } from "@/app";

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

  const selector = useMemo(() => {
    return createSelectorTs([(state) => state.board.turn], (turn) => {
      return {
        turn,
      };
    });
  }, []);

  const { turn } = useSelectorTs(selector);
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <Board setup={parseFEN(setup)} />
      </div>

      <div className={styles.info}>DopInfo</div>
    </div>
  );
};

export default CurrentGame;
