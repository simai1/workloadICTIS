import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducer as filtersReducer } from "./filter/filter.slice";
import isCheckedSlice from "./isChecked.slice.js";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  filters: filtersReducer,
  isCheckedSlice: isCheckedSlice,
});

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["todos"],
  // blacklist: ["todos"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
