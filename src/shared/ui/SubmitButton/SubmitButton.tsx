import React from "react";

import styles from "./SubmitButton.module.css";

interface buttonI {
  title: string;
}

const SubmitButton = ({ title }: buttonI) => {
  return <button className={styles.button}>{title}</button>;
};

export default SubmitButton;
