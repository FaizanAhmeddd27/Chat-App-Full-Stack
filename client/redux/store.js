import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "./socket/socket.slice";

const store = configureStore({
  reducer: {
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socket.socket"],
        ignoredActions: ["socket/initializeSocket"],
      },
    }),
});

export default store;  
