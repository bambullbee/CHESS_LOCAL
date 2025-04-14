import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardSlice/boardSlice";
import navigationReducer from "./slices/navigationSlice/navigationSlice";

export const store = configureStore({
  reducer: {
    board: boardReducer,
    navigation: navigationReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
