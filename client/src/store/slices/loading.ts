import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../state'

interface LoadingState {
  loading: boolean,
  message? : string,
}

const initialState: LoadingState = {
  loading : false
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    LoadingTrue: (state,action) => {
      state.loading = true;
    },
    LoadingFalse: (state,action) => {
        state.loading = false;
    },
    MessageTrue: (state,action) => {
        state.message = action.payload;
    },
    MessageFalse: (state,action) => {
        state.message = "";
    },
  },
})

export const { MessageTrue, MessageFalse, LoadingFalse, LoadingTrue } = loadingSlice.actions

export default loadingSlice.reducer
