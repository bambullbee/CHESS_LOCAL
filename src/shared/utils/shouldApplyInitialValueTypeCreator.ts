const shouldApplyInitialValueTypeCreator = <T>() => {
  return (games: T) => {
    let areThereAnyValuesInStorage = false;
    for (let gameId in games) {
      if (games[gameId]) {
        areThereAnyValuesInStorage = true;
        break;
      }
    }
    return areThereAnyValuesInStorage;
  };
};

export default shouldApplyInitialValueTypeCreator;
