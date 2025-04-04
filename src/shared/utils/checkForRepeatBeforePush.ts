const checkForRepeatBeforePush = <S>(array: S[], value: S) => {
  if (array.includes(value)) {
    return [...array, value];
  } else {
    return array;
  }
};

export default checkForRepeatBeforePush;
