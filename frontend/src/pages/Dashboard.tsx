import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import DataTable from '../components/DataTable';
import { useSocket } from '../hooks/useSocket';
import axios from 'axios';

const Dashboard: React.FC = () => {
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState<any[]>([]);
   const realTimeData = useSocket('newData');

   // Fetch historical data
   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get('http://localhost:3000/api/data');
            setData(response.data);
         } catch (error) {
            console.error('Error fetching historical data:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   // Merge historical and real-time data
   useEffect(() => {
      setData((prev) => [...realTimeData, ...prev]);
   }, [realTimeData]);

   return (
      <Container>
         <Typography variant="h4" gutterBottom>
            HTTP Monitoring Dashboard
         </Typography>
         {loading ? <CircularProgress /> : <DataTable rows={data} />}
      </Container>
   );
};

export default Dashboard;
