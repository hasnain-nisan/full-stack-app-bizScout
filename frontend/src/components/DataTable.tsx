// components/DataTable.tsx
import React from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Paper,
   Typography,
   Button,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { openModal } from '../store/modalSlice';

export interface DataRow {
   requestPayload: {
      requestId: string;
      source?: string;
      event: {
         url: string;
         method: string;
         type: string;
         headers?: {};
         body?: {
            action: string;
            parameters: {
               region: string;
               retries: number;
            };
         };
      };
      metadata: {
         priority: string;
         tags?: [tag: string];
         environment?: string;
      };
   };
   response: {
      origin: string;
      url?: string;
      method: string;
      headers?: {};
      json: {};
   };
   timestamp: string;
}

interface DataTableProps {
   rows: DataRow[];
}

const DataTable: React.FC<DataTableProps> = ({ rows }) => {
   const dispatch = useDispatch();

   const handleOpenModal = (row: DataRow) => {
      dispatch(openModal(row)); // Dispatch the action to open the modal with selected row data
   };

   return (
      <Paper style={{ overflow: 'auto' }}>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>
                     <Typography variant="subtitle1" fontWeight="bold">
                        #
                     </Typography>
                  </TableCell>
                  <TableCell>
                     <Typography variant="subtitle1" fontWeight="bold">
                        Timestamp
                     </Typography>
                  </TableCell>
                  <TableCell>
                     <Typography variant="subtitle1" fontWeight="bold">
                        Request Details
                     </Typography>
                  </TableCell>
                  <TableCell>
                     <Typography variant="subtitle1" fontWeight="bold">
                        Response Details
                     </Typography>
                  </TableCell>
                  <TableCell>
                     <Typography variant="subtitle1" fontWeight="bold">
                        Actions
                     </Typography>
                  </TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {rows.map((row, index) => {
                  const { requestPayload, response, timestamp } = row;
                  const { event, metadata } = requestPayload || {};
                  const { url, method, body } = event || {};
                  const { action, parameters } = body || {};
                  const priority = metadata?.priority;
                  const region = parameters?.region;

                  return (
                     <TableRow key={index}>
                        {/* Row Number */}
                        <TableCell>
                           <Typography>{index + 1}</Typography>
                        </TableCell>

                        {/* Timestamp */}
                        <TableCell>
                           <Typography>
                              {new Date(timestamp).toLocaleString()}
                           </Typography>
                        </TableCell>

                        {/* Request Details */}
                        <TableCell>
                           <Typography>
                              <strong>URL:</strong> {url}
                           </Typography>
                           <Typography>
                              <strong>Method:</strong>{' '}
                              <span
                                 style={{
                                    color: method === 'POST' ? 'green' : 'blue',
                                    fontWeight: 'bold',
                                 }}
                              >
                                 {method}
                              </span>
                           </Typography>
                           <Typography>
                              <strong>Action:</strong> {action}
                           </Typography>
                           <Typography>
                              <strong>Region:</strong> {region}
                           </Typography>
                        </TableCell>

                        {/* Response Details */}
                        <TableCell>
                           <Typography>
                              <strong>Origin:</strong> {response?.origin}
                           </Typography>
                           <Typography>
                              <strong>Priority:</strong>{' '}
                              <span
                                 style={{
                                    color:
                                       priority === 'low' ? 'orange' : 'red',
                                    fontWeight: 'bold',
                                 }}
                              >
                                 {priority}
                              </span>
                           </Typography>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                           <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenModal(row)}
                           >
                              View Details
                           </Button>
                        </TableCell>
                     </TableRow>
                  );
               })}
            </TableBody>
         </Table>
      </Paper>
   );
};

export default DataTable;
