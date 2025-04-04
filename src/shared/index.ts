import { createAsyncThunkTs } from "./withTypesHooks/createAsyncThunk";
import useSelectorTs from "./withTypesHooks/useSelector";
import { useDispatchTs } from "./withTypesHooks/useDispatch";
import { getAttackedCells } from "./utils/getAttackedCells";
import { getDiagonalFields } from "./utils/getAttackedCells/getAttackedCells";
import getStartFigure from "./utils/getStartFigure";
import createSelectorTs from "./withTypesHooks/createSelector";

import type {
  FigureColor,
  FigureType,
  figureIconColors,
} from "./types/chessTypes";
import checkForRepeatBeforePush from "./utils/checkForRepeatBeforePush";
import type {
  Cell,
  Cells,
  processedLongRangeAttackers,
  initialStateI,
  attackingInfo,
} from "./types/boardSliceTypes";

import Pawn from "./icons/Pawn";
import Rook from "./icons/Rook";
import Knight from "./icons/Knight";
import Bishop from "./icons/Bishop";
import Queen from "./icons/Queen";
import King from "./icons/King";

export {
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
  createAsyncThunkTs,
  createSelectorTs,
  useSelectorTs,
  useDispatchTs,
  getAttackedCells,
  getDiagonalFields,
  getStartFigure,
  checkForRepeatBeforePush,
};

export type {
  FigureColor,
  FigureType,
  Cell,
  Cells,
  processedLongRangeAttackers,
  initialStateI,
  attackingInfo,
  figureIconColors,
};
