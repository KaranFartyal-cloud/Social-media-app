import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userProfile: null,
  },

  reducers: {
    //actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },

    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setAuthUser, setUserProfile } = authSlice.actions;
export default authSlice.reducer; //in store it expects the reducer not the whole slice (pitfall)
