import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../state";

// Define a type for the slice state
interface AuthState {
  token: string;
  isAuthenticated?: boolean;
  fullname: string;
  username: string;
  user_id: string;
  profileImg: string;
  follow_back: string[];
  followers: string[];
}

// Define the initial state using that type
const initialState: AuthState = {
  token: "",
  fullname: "",
  username: "",
  user_id: "",
  profileImg: "",
  follow_back: [],
  followers: [],
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    signin: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.username = action.payload.username;
      state.fullname = action.payload.fullname;
      state.user_id = action.payload.user_id;
      state.profileImg = action.payload.profileImg;
      state.follow_back = action.payload.follow_back;
      state.followers = action.payload.followers;
    },
    signup: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.username = action.payload.username;
      state.fullname = action.payload.fullname;
      state.user_id = action.payload.user_id;
      state.profileImg = action.payload.profileImg;
      state.follow_back = action.payload.follow_back;
      state.followers = action.payload.followers;
    },
    logout: (state, action) => {
      state.token = "";
      state.isAuthenticated = false;
      state.username = "";
      state.fullname = "";
      state.user_id = "";
      state.profileImg = "";
      state.follow_back = [];
      state.followers = [];
    },
    
    updateProfile: (state, action) => {
      state.profileImg = action.payload.profileImg;
      state.follow_back = action.payload.follow_back;
      state.followers = action.payload.followers;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
});

export const { signin, signup, logout, updateProfile } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.auth.value

export default authSlice.reducer;
