import { pagesT } from "@/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateI {
  page: pagesT;
  gameId: string;
}

const initialState: initialStateI = {
  page: "newgame",
  gameId: null,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    changePage(state, { payload }: PayloadAction<pagesT>) {
      state.page = payload;
    },
    chooseGame(state, { payload }: PayloadAction<string>) {
      state.gameId = payload;
    },
  },
});

export default navigationSlice.reducer;

export const { changePage, chooseGame } = navigationSlice.actions;
