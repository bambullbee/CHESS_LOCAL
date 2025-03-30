import {
  processedLongRangeAttackers,
  handler,
} from "../../../types/boardSliceTypes";

const getDiversedResults = (): handler => {
  const res: processedLongRangeAttackers = {
    range: [],
    availableCells: [],
    frozenId: null,
    doesAttackKing: false,
  };
  let wasEncounteredWithFigure: boolean = false;
  let prevCell: number;
  let shouldCheckForFrozen = true;
  let isObstacleOnWay = false;
  return (state, id, resultId, shouldReturn, shouldReset) => {
    if (shouldReset) {
      wasEncounteredWithFigure = false;
      prevCell = null;
      isObstacleOnWay = false;
      return;
    }
    if (shouldReturn) {
      return res;
    }
    res.range.push(resultId);
    if (
      state[resultId].figure === "king" &&
      !wasEncounteredWithFigure &&
      state[resultId].color !== state[id].color
    ) {
      res.doesAttackKing = true;
      wasEncounteredWithFigure = true;
    }
    let isFigure = Boolean(state[resultId].figure);
    if (isFigure && shouldCheckForFrozen && !res.doesAttackKing) {
      wasEncounteredWithFigure = true;
      if (prevCell) {
        if (
          state[resultId].figure === "king" &&
          state[resultId].color !== state[id].color &&
          state[prevCell].color !== state[id].color
        ) {
          res.frozenId = prevCell;
        } else {
          shouldCheckForFrozen = false;
        }
      } else {
        prevCell = resultId;
      }
    }
    if (!isObstacleOnWay) {
      if (state[resultId].figure) {
        res.availableCells.push(resultId);
        isObstacleOnWay = true;
      } else {
        res.availableCells.push(resultId);
      }
    }
  };
};

export default getDiversedResults;
