import styles from "./LeaderBoardEntity.module.css";

interface leaderBoardEntityI {
  name: string;
  wins: string;
  isOdd: boolean;
}

const LeaderBoardEntity = ({ name, wins, isOdd }: leaderBoardEntityI) => {
  return (
    <div className={`${styles.container} ${isOdd ? styles.odd : ""}`}>
      <div className={styles.name}>{name} </div>
      <div className={styles.wins}>{wins}</div>
    </div>
  );
};

export default LeaderBoardEntity;
