import { createSlice } from "@reduxjs/toolkit";

const isCheckedSlice = createSlice({
  name: "isChecked",
  initialState: {
    isChecked: [],
  },

  reducers: {
    addChecked(state, action) {
      state.isChecked.push({
        // id: new Date().toISOString(),
        itemKey: action.payload.itemKey,
        value: action.payload.value,
      });
    },
    removeChecked(state, action) {
      state.isChecked = state.isChecked.filter(
        (item) => item.value !== action.payload.value
      );
    },
  },
});

export const { addChecked, removeChecked } = isCheckedSlice.actions;

export default isCheckedSlice.reducer;
