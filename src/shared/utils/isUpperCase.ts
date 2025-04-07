const isUpperCase = (char: string) => {
  return char === char.toUpperCase() && char !== char.toLowerCase();
};

export default isUpperCase;
