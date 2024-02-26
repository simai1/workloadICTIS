import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducer as filtersReducer } from "./filter/filter.slice";

const rootReducer = combineReducers({
  filters: filtersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
