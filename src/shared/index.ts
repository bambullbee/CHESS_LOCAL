import { createAsyncThunkTs } from "./withTypesHooks/createAsyncThunk";
import useSelectorTs from "./withTypesHooks/useSelector";
import { useDispatchTs } from "./withTypesHooks/useDispatch";
import { getAttackedCells } from "./utils/getAttackedCells";
import { getDiagonalFields } from "./utils/getAttackedCells/getAttackedCells";
import getStartFigure from "./utils/getStartFigure";

import type { FigureColor, FigureType } from "./types/chessTypes";
import type {
  Cell,
  Cells,
  processedLongRangeAttackers,
  initialStateI,
} from "./types/boardSliceTypes";

export {
  createAsyncThunkTs,
  useSelectorTs,
  useDispatchTs,
  getAttackedCells,
  getDiagonalFields,
  getStartFigure,
};

export type {
  FigureColor,
  FigureType,
  Cell,
  Cells,
  processedLongRangeAttackers,
  initialStateI,
};
