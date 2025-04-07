const literalCellToId = (cell: string) => {
  const parts = cell.split("");
  let firstSummand: number;
  switch (parts[0]) {
    case "a":
      firstSummand = 8;
    case "b":
      firstSummand = 7;
    case "c":
      firstSummand = 6;
    case "d":
      firstSummand = 5;
    case "e":
      firstSummand = 4;
    case "f":
      firstSummand = 3;
    case "g":
      firstSummand = 2;
    case "h":
      firstSummand = 1;
  }
  return firstSummand + parseInt(parts[1]);
};

export default literalCellToId;
