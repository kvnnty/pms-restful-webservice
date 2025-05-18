import axiosClient from "@/config/axios.config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get("/users/accounts/me");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
