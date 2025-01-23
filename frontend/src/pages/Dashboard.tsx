import React, { useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { AccessTime, CheckCircle, PriorityHigh } from "@mui/icons-material";
import DataTable from "../components/DataTable";
import { useDispatch, useSelector } from "react-redux";
import { addNewData, fetchData } from "../store/dashboardSlice";
import { AppDispatch, RootState } from "../store/store";
import { useSocket } from "../hooks/useSocket";
import RowDetailsModal from "../components/RowDetailsModal";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, totalRequests, postRequests, highPriorityRequests } = useSelector(
    (state: RootState) => state.dashboard
  );

  const realTimeData = useSocket("newData");

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // Listen to real-time updates
  useEffect(() => {
    
    if (realTimeData.length > 0) {
      dispatch(addNewData(realTimeData[0]));
    }
  }, [realTimeData, dispatch]);

  return (
    <Container style={{ padding: "2rem" }}>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          marginBottom: "2rem",
          textAlign: "center",
          fontWeight: "bold",
          color: "#1976d2",
        }}
      >
        HTTP Monitoring Dashboard
      </Typography>

      {/* Statistics Section */}
      <Grid container spacing={4} style={{ marginBottom: "2rem" }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} style={{ textAlign: "center", padding: "1rem" }}>
            <CardContent>
              <AccessTime style={{ fontSize: "3rem", color: "#1976d2" }} />
              <Typography variant="h6" style={{ marginTop: "0.5rem" }}>
                Total Requests
              </Typography>
              <Typography variant="h4" style={{ fontWeight: "bold", marginTop: "0.5rem" }}>
                {totalRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} style={{ textAlign: "center", padding: "1rem" }}>
            <CardContent>
              <CheckCircle style={{ fontSize: "3rem", color: "#388e3c" }} />
              <Typography variant="h6" style={{ marginTop: "0.5rem" }}>
                POST Requests
              </Typography>
              <Typography
                variant="h4"
                style={{ fontWeight: "bold", color: "#388e3c", marginTop: "0.5rem" }}
              >
                {postRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} style={{ textAlign: "center", padding: "1rem" }}>
            <CardContent>
              <PriorityHigh style={{ fontSize: "3rem", color: "#d32f2f" }} />
              <Typography variant="h6" style={{ marginTop: "0.5rem" }}>
                High Priority Requests
              </Typography>
              <Typography
                variant="h4"
                style={{ fontWeight: "bold", color: "#d32f2f", marginTop: "0.5rem" }}
              >
                {highPriorityRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table Section */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <CircularProgress />
          <Typography variant="body1" style={{ marginTop: "1rem", color: "#757575" }}>
            Loading data, please wait...
          </Typography>
        </div>
      ) : (
        <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
          <Typography
            variant="h6"
            style={{ marginBottom: "1rem", fontWeight: "bold", color: "#1976d2" }}
          >
            Requests Table
          </Typography>
          <DataTable rows={data} />
        </Paper>
      )}

      {/* Row Details Modal */}
      <RowDetailsModal />
    </Container>
  );
};

export default Dashboard;
