import { createAsyncThunk } from "@reduxjs/toolkit";

import type { RootState, AppDispatch } from "@/app/store";

export const createAsyncThunkTs = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
}>();
