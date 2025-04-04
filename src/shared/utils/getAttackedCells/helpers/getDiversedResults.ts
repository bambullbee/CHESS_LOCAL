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
    towardsKing: { path: [], isCompletedPath: false },
  };
  let prevCell: number;
  let shouldCheckForFrozen = true;
  let isObstacleOnWay = false;
  return (state, id, resultId, shouldReturn, shouldReset) => {
    if (shouldReset) {
      prevCell = null;
      isObstacleOnWay = false;
      shouldCheckForFrozen = true;
      if (res.frozenId || res.doesAttackKing) {
        res.towardsKing.isCompletedPath = true;
      }
      if (!res.towardsKing.isCompletedPath) {
        res.towardsKing.path = [];
      }
      return;
    }
    if (shouldReturn) {
      if (res.frozenId || res.doesAttackKing) {
        res.towardsKing.isCompletedPath = true;
      }
      if (!res.towardsKing.isCompletedPath && !res.frozenId) {
        res.towardsKing.path = [];
      }
      return res;
    }
    res.range.push(resultId);
    if (
      state[resultId].figure === "king" &&
      !isObstacleOnWay &&
      state[resultId].color !== state[id].color
    ) {
      res.doesAttackKing = true;
    }
    let isFigure = Boolean(state[resultId].figure);
    if (isFigure && shouldCheckForFrozen && !res.doesAttackKing) {
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
      if (isFigure) {
        res.availableCells.push(resultId);
        isObstacleOnWay = true;
      } else {
        res.availableCells.push(resultId);
      }
    }
    if (state[resultId].figure !== "king" && !res.towardsKing.isCompletedPath) {
      res.towardsKing.path.push(resultId);
    }
  };
};

export default getDiversedResults;
