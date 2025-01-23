// redux/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataRow } from "../components/DataTable"; // Import your DataRow interface

interface ModalState {
  open: boolean;
  selectedRow: DataRow | null;
}

const initialState: ModalState = {
  open: false,
  selectedRow: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<DataRow>) {
      state.open = true;
      state.selectedRow = action.payload;
    },
    closeModal(state) {
      state.open = false;
      state.selectedRow = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
