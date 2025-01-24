import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer, {
   fetchData,
   addNewData,
} from '../store/dashboardSlice';
import modalReducer from '../store/modalSlice';
import Dashboard from '../pages/Dashboard';
import { useSocket } from '../hooks/useSocket';
import '@testing-library/jest-dom';
import React, { act } from 'react';
import { Store } from '@reduxjs/toolkit'; // Import the Store type
import { RootState } from '../store/store';

// Mock the useSocket hook to simulate real-time updates
jest.mock('../hooks/useSocket', () => ({
   useSocket: jest.fn(),
}));

// Mock the API call
jest.mock('../api/axiosInstance', () => ({
   get: jest.fn(() =>
      Promise.resolve({
         data: [
            {
               _id: '2',
               timestamp: '2025-01-24T16:16:38Z',
               requestPayload: { path: '/api/test', method: 'POST' },
               response: { status: 200, priority: 'high' },
            },
         ],
      })
   ),
}));

// Helper to create a mock store
const createMockStore = (preloadedState = {}) =>
   configureStore({
      reducer: {
         dashboard: dashboardReducer,
         modal: modalReducer,
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
         getDefaultMiddleware({
            serializableCheck: false, // Disable slow middleware for tests
            immutableCheck: false,
         }),
   });

describe('Dashboard Component', () => {
   let store: Store<RootState>;

   it('renders loading spinner when data is being fetched', async () => {
      const preloadedState = {
         dashboard: {
            loading: true,
            data: [],
            totalRequests: 0,
            postRequests: 0,
            highPriorityRequests: 0,
            error: null,
         },
         modal: {
            open: false,
            data: null,
         },
      };
      store = createMockStore(preloadedState);
      render(
         <Provider store={store}>
            <Dashboard />
         </Provider>
      );
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(
         screen.getByText('Loading data, please wait...')
      ).toBeInTheDocument();
   });

   it('displays data when it has been fetched', async () => {
      const preloadedState = {
         dashboard: {
            loading: false,
            data: [
               {
                  _id: '2',
                  timestamp: '2025-01-24T16:16:38Z',
                  requestPayload: { path: '/api/test', method: 'POST' },
                  response: { status: 200, priority: 'high' },
               },
            ],
            totalRequests: 1,
            postRequests: 1,
            highPriorityRequests: 1,
            error: null,
         },
         modal: {
            open: false,
            data: null,
         },
      };

      const store = createMockStore(preloadedState);

      await act(async () => {
         render(
            <Provider store={store}>
               <Dashboard />
            </Provider>
         );
      });

      // Wait for the data to appear
      // await waitFor(() => {
      expect(screen.getByText('Requests Table')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
      // });
   });

   // it('updates with real-time data', async () => {
   //   store = createMockStore({
   //     dashboard: {
   //       loading: false,
   //       data: mockData,
   //       totalRequests: 1,
   //       postRequests: 1,
   //       highPriorityRequests: 1,
   //       error: null,
   //     },
   //   });

   //   render(
   //     <Provider store={store}>
   //       <Dashboard />
   //     </Provider>
   //   );

   //   // Simulate real-time data update
   //   await waitFor(() => {
   //     store.dispatch(addNewData(mockSocketData[0]));
   //   });

   //   // Verify real-time data appears in the table
   //   expect(screen.getByText('/api/socket-test')).toBeInTheDocument();
   //   expect(screen.getByText('medium')).toBeInTheDocument();
   // });

   // it('handles empty data gracefully', async () => {
   //   store = createMockStore({
   //     dashboard: {
   //       loading: false,
   //       data: [],
   //       totalRequests: 0,
   //       postRequests: 0,
   //       highPriorityRequests: 0,
   //       error: null,
   //     },
   //   });

   //   render(
   //     <Provider store={store}>
   //       <Dashboard />
   //     </Provider>
   //   );

   //   expect(screen.getByText('Requests Table')).toBeInTheDocument();
   //   expect(screen.queryByText('/api/test')).not.toBeInTheDocument();
   //   expect(screen.queryByText('POST')).not.toBeInTheDocument();
   // });

   // it('handles errors in fetching data', async () => {
   //   store = createMockStore({
   //     dashboard: {
   //       loading: false,
   //       data: [],
   //       totalRequests: 0,
   //       postRequests: 0,
   //       highPriorityRequests: 0,
   //       error: 'Failed to fetch data',
   //     },
   //   });

   //   render(
   //     <Provider store={store}>
   //       <Dashboard />
   //     </Provider>
   //   );

   //   expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
   // });
});
