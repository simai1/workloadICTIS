import { createSlice } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    scheduleSelectedFilter: { select: "Все" },
  },

  reducers: {
    setScheduleSelected(state, action) {
      const { select } = action.payload;
      state.scheduleSelectedFilter.select = select;
    },
  },
});

export const { setScheduleSelected } = scheduleSlice.actions;

export default scheduleSlice.reducer;
