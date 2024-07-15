import { createSlice } from "@reduxjs/toolkit";

const isCheckedSlice = createSlice({
  name: "isChecked",
  initialState: {
    isChecked: {},
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
    addChecked(state, action) {
      const { tableName, itemKey, value } = action.payload;
      if (!state.isChecked[tableName]) {
        state.isChecked[tableName] = [];
      }
      state.isChecked[tableName].push({
        itemKey,
        value,
      });
    },

    //! удалить из массива фильтрацию по заголовку
    removeChecked(state, action) {
      const { tableName, value } = action.payload;
      if (!state.isChecked[tableName]) {
        state.isChecked[tableName] = [];
      }
      state.isChecked[tableName] = state.isChecked[tableName].filter(
        (item) => item.value !== value
      );
    },

    //! добавление массива
    addAllCheckeds(state, action) {
      const { tableName, checked } = action.payload;
      if (!state.isChecked[tableName]) {
        state.isChecked[tableName] = [];
      }
      state.isChecked[tableName] = [...state.isChecked[tableName], ...checked];
    },

    //! удаление по ключу для all
    removeAllCheckeds(state, action) {
      const { tableName, itemKey } = action.payload;
      if (!state.isChecked[tableName]) {
        state.isChecked[tableName] = [];
      }
      state.isChecked[tableName] = state.isChecked[tableName].filter(
        (item) => item.itemKey !== itemKey
      );
    },

    //! сбросить весь фильтр по таблице
    removeTableCheckeds(state, action) {
      const { tableName } = action.payload;
      if (!state.isChecked[tableName]) {
        state.isChecked[tableName] = [];
      }
      state.isChecked[tableName] = [];
    },
  },
});

export const {
  addChecked,
  removeChecked,
  addAllCheckeds,
  removeAllCheckeds,
  removeTableCheckeds,
} = isCheckedSlice.actions;

export default isCheckedSlice.reducer;
