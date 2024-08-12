import { createSlice } from "@reduxjs/toolkit";

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    scheduleSelectedFilter: { select: "Все", param: "" },
  },

  reducers: {
    setScheduleSelected(state, action) {
      const { select } = action.payload;
      state.scheduleSelectedFilter.select = select;
      if (select === "Новые") {
        state.scheduleSelectedFilter.param = "isActual=true";
      } else if (select === "Старые") {
        state.scheduleSelectedFilter.param = "isActual=false";
      } else {
        state.scheduleSelectedFilter.param = "";
      }
    },
  },
});

export const { setScheduleSelected } = scheduleSlice.actions;

export default scheduleSlice.reducer;
