import { createAsyncThunkTs } from "./withTypesHooks/createAsyncThunk";
import useSelectorTs from "./withTypesHooks/useSelector";
import { useDispatchTs } from "./withTypesHooks/useDispatch";
import { getAttackedCells } from "./utils/getAttackedCells";

import type { FigureColor, FigureType } from "./types/chessTypes";
import type { Cell } from "./types/boardSliceTypes";

export { createAsyncThunkTs, useSelectorTs, useDispatchTs, getAttackedCells };

export type { FigureColor, FigureType, Cell };
