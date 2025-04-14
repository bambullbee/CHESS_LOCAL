import { pagesT, useDispatchTs, useSelectorTs } from "@/shared";
import styles from "./HeaderLink.module.css";
import { changePage } from "@/app";

interface linkI {
  path: string;
  title: string;
  onClick: () => void;
}

const HeaderLink = ({ path, title, onClick }: linkI) => {
  const location = useSelectorTs((state) => state.navigation.page);

  const dispatch = useDispatchTs();

  return (
    <li>
      <button
        className={`${styles.link} ${path === location ? styles.active : ""}`}
        onClick={() => {
          if (onClick) {
            dispatch(changePage(path as pagesT));
            onClick();
          }
        }}
      >
        {title}
      </button>
    </li>
  );
};

export default HeaderLink;
