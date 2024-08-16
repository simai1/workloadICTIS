import { combineReducers, configureStore } from "@reduxjs/toolkit";
import isCheckedSlice from "./filter/isChecked.slice.js";
import editInputChecked from "./filter/editInputChecked.slice.js";
import textAreaSlice from "./popup/textareaData.slice.js";
import scheduleSlice from "./schedule/schedule.slice.js";
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
  isCheckedSlice: isCheckedSlice,
  editInputChecked: editInputChecked,
  textAreaSlice: textAreaSlice,
  scheduleSlice: scheduleSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["isCheckedSlice", "editInputChecked", "scheduleSlice"],
  // blacklist: ["isCheckedSlice"],
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
