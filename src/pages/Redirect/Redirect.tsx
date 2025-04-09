import { useLayoutEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Redirect = () => {
  const [hasProgress, setHasProgress] = useState(false);
  useLayoutEffect(() => {
    const gamesString = localStorage.getItem("games");
    if (gamesString && gamesString !== "{}") {
      setHasProgress(true);
    }
  }, []);
  if (hasProgress) {
    return <Navigate to="/games" replace />;
  } else {
    return <Navigate to="/newgame" replace />;
  }
};

export default Redirect;
