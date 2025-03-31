import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app";

const createSelectorTs = createSelector.withTypes<RootState>();

export default createSelectorTs;
