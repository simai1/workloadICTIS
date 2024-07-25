import { createSlice } from "@reduxjs/toolkit";

const textareaSlice = createSlice({
  name: "textarea",
  initialState: {
    textarea: false,
    taValue: "",
    originalValue: "",
    key: "",
    itemId: "",
    status: null,
  },

  reducers: {
    //! запись всех изночальных данных
    addAllState(state, action) {
      const { taValue, key, itemId } = action.payload;
      state.taValue = taValue;
      state.key = key;
      state.originalValue = taValue;
      state.itemId = itemId;
    },

    //! открыть закрыть окно редактирования
    onTextareaShow(state) {
      state.textarea = !state.textarea;
    },

    //! изменяем текст в textarea
    setTextAreaValue(state, action) {
      const { value } = action.payload;
      state.taValue = value;
    },

    //!  записать ключ
    setKey(state, action) {
      const { key } = action.payload;
      state.key = key;
    },

    //! записать оригинальный текст
    setOriginalValue(state, action) {
      const { value } = action.payload;
      state.originalValue = value;
    },

    //! функция сброса значения
    resetTheValue(state) {
      state.taValue = state.originalValue;
    },

    //! функция отмены редактирования
    cancleEditTd(state) {
      state.textarea = false;
      state.taValue = state.originalValue;
    },

    //! функция изменить статус
    resetStatus(state, action) {
      const { value } = action.payload;
      state.status = value;
    },
  },
});

export const {
  onTextareaShow,
  setTextAreaValue,
  setOriginalValue,
  resetTheValue,
  cancleEditTd,
  resetStatus,
  setKey,
  addAllState,
} = textareaSlice.actions;

export default textareaSlice.reducer;
