// components/RowDetailsModal.tsx
import React from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   Typography,
   Box,
   Chip,
   Grid,
   Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../store/modalSlice';
import { RootState } from '../store/store';
import { PriorityHigh, Tag, Event } from '@mui/icons-material';

const RowDetailsModal: React.FC = () => {
   const dispatch = useDispatch();
   const modalState = useSelector((state: RootState) => state.modal);

   const handleCloseModal = () => {
      dispatch(closeModal());
   };

   if (!modalState.selectedRow) return null;

   const { selectedRow } = modalState;
   const { requestPayload, response, timestamp } = selectedRow;
   const { event, metadata } = requestPayload || {};
   const { url, method, headers, body } = event || {};
   const { action, parameters } = body || {};
   const { region, retries } = parameters || {};
   const priority = metadata?.priority;
   const tags = metadata?.tags;

   return (
      <Dialog
         open={modalState.open}
         onClose={handleCloseModal}
         maxWidth="md"
         fullWidth
      >
         <DialogTitle sx={{ fontWeight: 'bold', fontSize: 24 }}>
            Row Details
         </DialogTitle>
         <DialogContent sx={{ padding: 3 }}>
            {/* Metadata Section */}
            <Box
               sx={{
                  marginBottom: '1.5rem',
                  padding: 2,
                  border: '1px solid #ddd',
                  borderRadius: 2,
               }}
            >
               <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', marginBottom: '0.75rem' }}
               >
                  <PriorityHigh
                     sx={{ verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  Metadata
               </Typography>
               <Typography variant="body1">
                  <strong>Environment:</strong> {metadata?.environment}
               </Typography>
               <Typography variant="body1">
                  <strong>Priority:</strong>{' '}
                  <span
                     style={{
                        color: priority === 'high' ? 'red' : 'orange',
                        fontWeight: 'bold',
                     }}
                  >
                     {priority}
                  </span>
               </Typography>
               {tags && (
                  <Typography
                     variant="body1"
                     sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: '0.75rem',
                     }}
                  >
                     <strong>Tags:</strong>{' '}
                     {tags.map((tag, index) => (
                        <Chip
                           key={index}
                           label={tag}
                           size="small"
                           sx={{ margin: '0.2rem' }}
                           icon={<Tag />}
                        />
                     ))}
                  </Typography>
               )}
            </Box>

            {/* <Divider sx={{ marginBottom: "1.5rem" }} /> */}

            {/* Request Payload Section */}
            <Box
               sx={{
                  marginBottom: '1.5rem',
                  padding: 2,
                  border: '1px solid #ddd',
                  borderRadius: 2,
               }}
            >
               <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', marginBottom: '1rem' }}
               >
                  <Event sx={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  Request Payload
               </Typography>
               <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                     <Typography variant="body1">
                        <strong>Request ID:</strong> {requestPayload.requestId}
                     </Typography>
                     <Typography variant="body1">
                        <strong>Source:</strong> {requestPayload.source}
                     </Typography>
                     <Typography variant="body1">
                        <strong>Event Type:</strong> {event?.type}
                     </Typography>
                     <Typography variant="body1">
                        <strong>URL:</strong> {url}
                     </Typography>
                     <Typography variant="body1">
                        <strong>Method:</strong>{' '}
                        <Typography
                           component="span"
                           sx={{
                              color: method === 'POST' ? 'green' : 'blue',
                              fontWeight: 'bold',
                           }}
                        >
                           {method}
                        </Typography>
                     </Typography>
                     <Typography variant="body1">
                        <strong>Headers:</strong>
                        <pre
                           style={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                           }}
                        >
                           {JSON.stringify(headers, null, 2)}
                        </pre>
                     </Typography>
                     <Typography variant="body1">
                        <strong>Body Action:</strong> {action}
                     </Typography>
                     <Typography variant="body1">
                        <strong>Region:</strong> {region}
                     </Typography>
                     <Typography variant="body1">
                        <strong>Retries:</strong> {retries}
                     </Typography>
                  </Grid>
               </Grid>
            </Box>

            {/* <Divider sx={{ marginBottom: "1.5rem" }} /> */}

            {/* Response Section */}
            <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2 }}>
               <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', marginBottom: '1rem' }}
               >
                  Response
               </Typography>
               <Typography variant="body1">
                  <strong>Origin:</strong> {response?.origin}
               </Typography>
               <Typography variant="body1">
                  <strong>Response URL:</strong> {response?.url}
               </Typography>
               <Typography variant="body1">
                  <strong>Response Method:</strong> {response?.method}
               </Typography>
               <Typography variant="body1">
                  <strong>Response Headers:</strong>
                  <pre
                     style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  >
                     {JSON.stringify(response?.headers, null, 2)}
                  </pre>
               </Typography>
               <Typography variant="body1">
                  <strong>Response Body:</strong>
                  <pre
                     style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  >
                     {JSON.stringify(response?.json, null, 2)}
                  </pre>
               </Typography>
            </Box>
         </DialogContent>

         <DialogActions sx={{ padding: '1rem' }}>
            <Button
               onClick={handleCloseModal}
               color="secondary"
               variant="outlined"
               sx={{ width: '100px' }}
            >
               Close
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default RowDetailsModal;
