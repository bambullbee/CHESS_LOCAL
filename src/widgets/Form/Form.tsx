import React, { FormEvent, ReactNode } from "react";
import { SubmitButton } from "@/shared";
import styles from "./Form.module.css";

interface formI {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const Form = ({ children, onSubmit }: formI) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
      <div>
        <SubmitButton title="Начать игру" />
      </div>
    </form>
  );
};

export default Form;
