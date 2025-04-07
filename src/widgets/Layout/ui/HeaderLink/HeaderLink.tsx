import React from "react";

import styles from "./HeaderLink.module.css";
import { Link, useLocation } from "react-router-dom";

interface linkI {
  path: string;
  title: string;
}

const HeaderLink = ({ path, title }: linkI) => {
  const location = useLocation().pathname;
  return (
    <li>
      <Link
        className={`${styles.link} ${path === location ? styles.active : ""}`}
        to={path}
      >
        {title}
      </Link>
    </li>
  );
};

export default HeaderLink;
