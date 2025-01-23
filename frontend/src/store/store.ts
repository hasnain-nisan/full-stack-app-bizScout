// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import dashboardReducer from "./dashboardSlice"; // Assuming you have other slices like dashboard

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    dashboard: dashboardReducer, // Add other reducers as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
