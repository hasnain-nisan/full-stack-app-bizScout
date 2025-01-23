import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

interface DataRow {
  _id: string;
  timestamp: string;
  requestPayload: {
    requestId: string;
    event: {
      type: string;
      url: string;
      method: string;
    };
    metadata: {
      environment: string;
      priority: string;
    };
  };
  response: {
    json: {
      event: {
        body: {
          action: string;
        };
      };
    };
    method: string;
    origin: string;
  };
}

interface DashboardState {
  data: DataRow[];
  loading: boolean;
  error: string | null;
  totalRequests: number;
  postRequests: number;
  highPriorityRequests: number;
}

const initialState: DashboardState = {
  data: [],
  loading: false,
  error: null,
  totalRequests: 0,
  postRequests: 0,
  highPriorityRequests: 0,
};

// Fetch data from the API
export const fetchData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/data");
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Handle adding real-time data
    addNewData(state, action: PayloadAction<DataRow>) {
      state.data.unshift(action.payload);
      state.totalRequests += 1;

      if (action.payload.requestPayload?.event?.method === "POST") {
        state.postRequests += 1;
      }

      if (action.payload.requestPayload?.metadata?.priority === "high") {
        state.highPriorityRequests += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;

        // Compute statistics
        state.totalRequests = action.payload.length;
        state.postRequests = action.payload.filter(
          (row: DataRow) => row.requestPayload?.event?.method === "POST"
        ).length;
        state.highPriorityRequests = action.payload.filter(
          (row: DataRow) => row.requestPayload?.metadata?.priority === "high"
        ).length;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { addNewData } = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;
