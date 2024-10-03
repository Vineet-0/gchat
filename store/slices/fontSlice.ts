import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FontState {
  fontSize: number;
  fontStyle: string;
}

const initialState: FontState = {
  fontSize: 15,
  fontStyle: 'normal',
};

const fontSlice = createSlice({
  name: 'font',
  initialState,
  reducers: {
    setFontSize(state, action: PayloadAction<number>) {
      state.fontSize = action.payload;
    },
    setFontStyle(state, action: PayloadAction<string>) {
      state.fontStyle = action.payload;
    },
    resetFontSettings(state) {
      state.fontSize = initialState.fontSize;
      state.fontStyle = initialState.fontStyle;
    },
  },
});

export const { setFontSize, setFontStyle, resetFontSettings } = fontSlice.actions;

export default fontSlice.reducer;
