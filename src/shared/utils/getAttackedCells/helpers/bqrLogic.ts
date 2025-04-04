import { Cells } from "@/shared";
import {
  processedLongRangeAttackers,
  handler,
} from "../../../types/boardSliceTypes";

const isCellTheSameRow = (idFirst: number, idSecond: number): boolean => {
  if (Math.ceil(idFirst / 8) === Math.ceil(idSecond / 8)) {
    return true;
  }
  return false;
};

const isNumberInRange = (start: number, end: number) => {
  return (id: number) => {
    return start < id && id < end;
  };
};

const isOnBoard = isNumberInRange(0, 65);

const rangeToCheck = [1, 2, 3, 4, 5, 6, 7, 8];

const bqrLogic = (
  signsToCheck: [number, number][],
  state: Cells,
  id: number,
  handler: handler
): processedLongRangeAttackers => {
  signsToCheck.forEach((signs) => {
    handler(state, id, 0, false, true);
    rangeToCheck.forEach((r) => {
      const sameColDiffRow = id + signs[0] * r * 8;
      const resultId = sameColDiffRow + signs[1] * r;
      if (isOnBoard(sameColDiffRow)) {
        if (isCellTheSameRow(sameColDiffRow, resultId)) {
          handler(state, id, resultId);
        }
      }
    });
  });
  return handler(state, 0, 0, true);
};

export default bqrLogic;

export { isCellTheSameRow, isOnBoard };
