import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Form } from "@/widgets/Form";
import { gameSettingsI, gamesI, Input, isValidFEN } from "@/shared";

import styles from "./NewGame.module.css";

const getUniqueIdForLS = (id?: number): number => {
  if (!id) {
    const uniqueId = Math.round(Math.random() * 100000);
    return getUniqueIdForLS(uniqueId);
  }
  const games = JSON.parse(localStorage.getItem("games")) as gamesI;
  if (games?.[id]) {
    return getUniqueIdForLS(Math.round(Math.random() * 100000));
  } else {
    return id;
  }
};

const NewGame = () => {
  const [validationError, setValidationError] = useState<{
    [key: string]: string;
  }>({});

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let isError: boolean;

    const white = formData.get("white") as string;
    if (white === "") {
      isError = true;
      setValidationError((prev) => ({
        ...prev,
        white: "Необходимо ввести имя пользователя",
      }));
    }

    const black = formData.get("black") as string;
    if (black === "") {
      isError = true;
      setValidationError((prev) => ({
        ...prev,
        black: "Необходимо ввести имя пользователя",
      }));
    }

    const timer = formData.get("timer") as string;
    if (Number.isNaN(parseInt(timer)) || parseInt(timer) <= 0) {
      isError = true;
      setValidationError((prev) => ({
        ...prev,
        timer: "Число должно быть больше нуля",
      }));
    }

    let bonus = formData.get("bonus") as string;
    if (Number.isNaN(parseInt(bonus))) {
      isError = true;
      bonus = "0";
    }

    const setup = formData.get("setup") as string;
    if (setup === "") {
      //OK
    } else if (!isValidFEN(setup)) {
      isError = true;
      setValidationError((prev) => ({
        ...prev,
        setup:
          "FEN не валидный. Очистите ввод, чтобы начать игру с базовым раскладом",
      }));
    }

    if (!isError) {
      const uniqueId = getUniqueIdForLS();
      const games = localStorage.getItem("games") as unknown as gamesI;
      const currentGame = {
        players: { white, black },
        timerInfo: { timer, bonus },
        setup,
      };
      localStorage.setItem(
        "games",
        JSON.stringify({
          ...games,
          [uniqueId.toString()]: currentGame,
        } as gamesI)
      );
      navigate(`/games/${uniqueId}`);
    }
  };

  const deleteValidationError = (name: string) => {
    setValidationError((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Form onSubmit={handleSubmit}>
          <div className={styles.formInnerContainer}>
            <div>
              <Input
                name="white"
                title="Белые, представьтесь:"
                initialValue="Неизвестный белый"
                deleteValidationError={deleteValidationError}
                error={validationError.white}
              />
            </div>
            <div>
              <Input
                name="black"
                title="Черные, представьтесь:"
                initialValue="Неизвестный черный"
                deleteValidationError={deleteValidationError}
                error={validationError.black}
              />
            </div>
            <div>
              <Input
                name="timer"
                title="Таймер: (минуты)"
                type="number"
                initialValue="10"
                deleteValidationError={deleteValidationError}
                error={validationError.timer}
              />
            </div>
            <div>
              <Input
                name="bonus"
                title="Дополнительное время за ход: (секунды)"
                type="number"
                initialValue="5"
                deleteValidationError={deleteValidationError}
                error={validationError.bonus}
              />
            </div>
            <div>
              <Input
                name="setup"
                title="Расклад доски по FEN"
                initialValue="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                deleteValidationError={deleteValidationError}
                error={validationError.setup}
              />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default NewGame;
