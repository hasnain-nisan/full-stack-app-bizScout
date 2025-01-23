import React from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Paper,
} from '@mui/material';

interface DataRow {
   requestPayload: any;
   response: any;
   timestamp: string;
}

interface DataTableProps {
   rows: DataRow[];
}

const DataTable: React.FC<DataTableProps> = ({ rows }) => {
   return (
      <Paper style={{ overflow: 'auto' }}>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Request Payload</TableCell>
                  <TableCell>Response</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {rows.map((row, index) => (
                  <TableRow key={index}>
                     <TableCell>
                        {new Date(row.timestamp).toLocaleString()}
                     </TableCell>
                     <TableCell>
                        <pre>{JSON.stringify(row.requestPayload, null, 2)}</pre>
                     </TableCell>
                     <TableCell>
                        <pre>{JSON.stringify(row.response, null, 2)}</pre>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </Paper>
   );
};

export default DataTable;
