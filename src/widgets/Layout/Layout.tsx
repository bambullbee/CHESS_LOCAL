import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import styles from "./Layout.module.css";
import HeaderLink from "./ui/HeaderLink/HeaderLink";
import Navigation from "./Navigation/Navigation";
import { useEffect, useState } from "react";

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
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
