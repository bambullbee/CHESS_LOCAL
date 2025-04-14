import styles from "./Layout.module.css";
import Navigation from "./Navigation/Navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelectorTs } from "@/shared";
import { NewGame } from "@/pages/NewGame";
import { Games } from "@/pages/Games";
import { CurrentGame } from "@/pages/CurrentGame";
import { Leaderboard } from "@/pages/Leaderboard";

const Layout = () => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const handleMenuLinkClick = () => {
    setIsMenuOpened(false);
  };

  useEffect(() => {
    const resizeHandler = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth > 780) {
        setIsMenuOpened(false);
      }
    };

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isMenuOpened) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMenuOpened]);

  const page = useSelectorTs((state) => state.navigation.page);
  const pageComponent = useMemo(() => {
    if (page === "newgame") {
      return <NewGame />;
    }
    if (page === "games") {
      return <Games />;
    }
    if (page === "game") {
      return <CurrentGame />;
    }
    if (page === "leaderboard") {
      return <Leaderboard />;
    }
  }, [page]);

  return (
    <div className={styles.container}>
      <div className={isMenuOpened ? styles.headerOpened : ""}>
        <header className={styles.header}>
          <div
            className={`${styles.navWrapper} ${
              isMenuOpened ? styles.opened : ""
            }`}
          >
            <div className={styles.nav}>
              <Navigation handleMenuLinkClick={handleMenuLinkClick} />
            </div>
          </div>
          <div className={styles.narrowHeader}>
            <h1>Шахматы на двоих</h1>
            <button
              className={styles.menuBtn}
              type="button"
              onClick={() => {
                setIsMenuOpened((prev) => !prev);
              }}
            >
              Меню
            </button>
          </div>
        </header>
      </div>
      <div className={styles.content}>{pageComponent}</div>
    </div>
  );
};

export default Layout;
