import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
  },

  reducers: {
    setOnineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnineUsers } = chatSlice.actions;
export default chatSlice.reducer;
