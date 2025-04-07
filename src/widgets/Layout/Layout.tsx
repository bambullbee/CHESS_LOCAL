import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import styles from "./Layout.module.css";
import HeaderLink from "./ui/HeaderLink/HeaderLink";

const Layout = () => {
  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <ul className={styles.list}>
            <HeaderLink title="Новая Игра" path="/newgame" />
            <HeaderLink title="Партии" path="/games" />
            <HeaderLink title="Таблица победителей" path="/leaderboard" />
          </ul>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
