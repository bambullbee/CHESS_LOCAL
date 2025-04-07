import { useEffect, useState } from "react";
import styles from "./Input.module.css";

interface inputI {
  name: string;
  title: string;
  type?: string;
  initialValue?: string;
  error: string;
  placeholder?: string;
  deleteValidationError: (name: string) => void;
}

const Input = ({
  name,
  type = "text",
  title,
  initialValue = "",
  error,
  placeholder,
  deleteValidationError,
}: inputI) => {
  const [value, setValue] = useState<string>(initialValue);

  return (
    <div className={`${styles.container} ${error ? styles.errorblock : ""}`}>
      <label className={styles.label} htmlFor={name}>
        {title}
        <input
          className={styles.input}
          name={name}
          type={type}
          id={name}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            deleteValidationError(name);
            setValue(e.target.value);
          }}
          onClick={() => {
            if (value === initialValue) {
              setValue("");
            }
          }}
        />
        <div className={styles.error}>{error}</div>
      </label>
    </div>
  );
};

export default Input;
