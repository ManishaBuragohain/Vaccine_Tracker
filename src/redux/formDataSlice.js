import { createSlice } from "@reduxjs/toolkit";

export const formDataSlice = createSlice({
  name: "formData",
  initialState: {
    firstName: "",
    lastName: "",
    pincode: "",
    email: "",
    date: "",
    statistics: [],
  },
  reducers: {
    saveFormData: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.pincode = action.payload.pincode;
      state.email = action.payload.email;
      state.date = action.payload.date;
    },
    saveStatistics: (state, action) => {
      state.statistics = action.payload.statistics;
    },
  },
});

export const { saveFormData, saveStatistics } = formDataSlice.actions;

export default formDataSlice.reducer;
