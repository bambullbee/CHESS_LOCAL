import HeaderLink from "../ui/HeaderLink/HeaderLink";

import styles from "./Navigation.module.css";

interface navigationI {
  handleMenuLinkClick: () => void;
}

const Navigation = ({ handleMenuLinkClick }: navigationI) => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <HeaderLink
          title="Новая Игра"
          path="/newgame"
          onClick={handleMenuLinkClick}
        />
        <HeaderLink
          title="Партии"
          path="/games"
          onClick={handleMenuLinkClick}
        />
        <HeaderLink
          title="Таблица победителей"
          path="/leaderboard"
          onClick={handleMenuLinkClick}
        />
      </ul>
    </nav>
  );
};

export default Navigation;
