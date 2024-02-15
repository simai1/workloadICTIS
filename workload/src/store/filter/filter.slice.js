import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleTofilter: (state, { payload: filter }) => {
      const value = filter;
      if (state.includes(value)) {
          state.splice(state.indexOf(value), 1);
        } else {
          state.push(value);
        }
    },
    initializeFilters: (state, { payload: tableHeaders }) => {
      const keys = tableHeaders.map(header => header.key);
      state.splice(0, state.length, ...keys);
    },
    
   
  },
});

export const { actions, reducer } = filterSlice;
