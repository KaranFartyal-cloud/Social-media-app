import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    notification: [],
  },

  reducers: {
    setNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.notification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.notification = state.notification.filter(
          (item) => item.userId !== action.payload.userId
        );
      } else {
        state.notification = action.payload;
      }
    },
  },
});

export const { setNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
