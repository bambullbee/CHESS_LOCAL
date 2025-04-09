import React from "react";

import styles from "./Timer.module.css";
import { FigureColor } from "@/shared";

interface timerI {
  name: string;
  time: string;
  isActive: boolean;
}

const Timer = ({ name, time, isActive }: timerI) => {
  return (
    <div className={`${styles.container} ${isActive ? styles.active : ""}`}>
      <div className={styles.name}>{name}</div>
      <div className={styles.time}>{time}</div>
    </div>
  );
};

export default Timer;
