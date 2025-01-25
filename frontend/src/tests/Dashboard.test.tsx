import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer, { addNewData } from '../store/dashboardSlice';
import modalReducer from '../store/modalSlice';
import Dashboard from '../pages/Dashboard';
import '@testing-library/jest-dom';
import React, { act } from 'react';
import { Store } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

const mockData = [
   {
      _id: '6793e421642cfe3ec108005e',
      timestamp: '2025-01-24T19:04:01.459Z',
      requestPayload: {
         requestId: '607275ed-6c02-4101-8bfc-47a0d7d02db5',
         timestamp: '2025-01-24T19:04:00.251Z',
         source: 'monitoring-service',
         event: {
            type: 'HTTP_CHECK',
            url: 'https://example.com/api/health',
            method: 'POST',
            headers: {
               Authorization: 'Bearer sampleToken',
               'Content-Type': 'application/json',
            },
            body: {
               userId: '7242',
               action: 'check_health',
               parameters: {
                  region: 'eu-central-1',
                  retries: 3,
               },
            },
         },
         metadata: {
            environment: 'production',
            priority: 'high',
            tags: ['monitoring', 'api-check', 'health-check'],
         },
      },
      response: {
         data: '{"requestId":"607275ed-6c02-4101-8bfc-47a0d7d02db5","timestamp":"2025-01-24T19:04:00.251Z","source":"monitoring-service","event":{"type":"HTTP_CHECK","url":"https://example.com/api/health","method":"POST","headers":{"Authorization":"Bearer sampleToken","Content-Type":"application/json"},"body":{"userId":"7242","action":"check_health","parameters":{"region":"eu-central-1","retries":3}}},"metadata":{"environment":"production","priority":"high","tags":["monitoring","api-check","health-check"]}}',
         headers: {
            Accept: 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, compress, deflate, br',
            'Content-Length': '496',
            'Content-Type': 'application/json',
            Host: 'httpbin.org',
            'User-Agent': 'axios/1.7.9',
            'X-Amzn-Trace-Id': 'Root=1-6793e423-7e03644708c7a1ed05fc703a',
         },
         json: {
            event: {
               body: {
                  action: 'check_health',
                  parameters: {
                     region: 'eu-central-1',
                     retries: 3,
                  },
                  userId: '7242',
               },
               headers: {
                  Authorization: 'Bearer sampleToken',
                  'Content-Type': 'application/json',
               },
               method: 'POST',
               type: 'HTTP_CHECK',
               url: 'https://example.com/api/health',
            },
            metadata: {
               environment: 'production',
               priority: 'high',
               tags: ['monitoring', 'api-check', 'health-check'],
            },
            requestId: '607275ed-6c02-4101-8bfc-47a0d7d02db5',
            source: 'monitoring-service',
            timestamp: '2025-01-24T19:04:00.251Z',
         },
         method: 'POST',
         origin: '180.149.232.19',
         url: 'https://httpbin.org/anything',
      },
      __v: 0,
   },
];

// Mock the useSocket hook to simulate real-time updates
jest.mock('../hooks/useSocket', () => ({
   useSocket: jest.fn(),
}));

// Mock the API call
jest.mock('../api/axiosInstance', () => ({
   get: jest.fn(() =>
      Promise.resolve({
         data: mockData,
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
            serializableCheck: false,
            immutableCheck: false,
         }),
   });

describe('Dashboard Component', () => {
   describe('renders loading spinner when data is being fetched', () => {
      it('shows loading state', async () => {
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
         const store = createMockStore(preloadedState);
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
   });

   describe('displays data when it has been fetched', () => {
      it('shows table and data', async () => {
         const preloadedState = {
            dashboard: {
               loading: false,
               data: mockData,
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

         expect(screen.getByText('Requests Table')).toBeInTheDocument();
         expect(screen.getByText('View Details')).toBeInTheDocument();
      });
   });

   describe('updates with real-time data', () => {
      it('adds new data on real-time updates', async () => {
         const store = createMockStore({
            dashboard: {
               loading: true,
               data: [],
               totalRequests: 0,
               postRequests: 0,
               highPriorityRequests: 0,
               error: null,
            },
         });

         render(
            <Provider store={store}>
               <Dashboard />
            </Provider>
         );

         // Simulate real-time data update
         await waitFor(() => {
            store.dispatch(addNewData(mockData[0]));
         });

         // Verify the updated data in the store
         const state = store.getState().dashboard;

         expect(state.totalRequests).toBe(1);
         expect(state.postRequests).toBe(1);
         expect(state.highPriorityRequests).toBe(1);
      });
   });

   describe('renders correctly with empty data', () => {
      it('shows "No data found"', async () => {
         const store = createMockStore({
            dashboard: {
               loading: false,
               data: [],
               totalRequests: 0,
               postRequests: 0,
               highPriorityRequests: 0,
               error: null,
            },
         });

         await act(async () => {
            render(
               <Provider store={store}>
                  <Dashboard />
               </Provider>
            );
         });

         expect(
            screen.getByText('HTTP Monitoring Dashboard')
         ).toBeInTheDocument();
         expect(screen.getByText('Total Requests')).toBeInTheDocument();
         expect(screen.getByText('POST Requests')).toBeInTheDocument();
         expect(screen.getByText('High Priority Requests')).toBeInTheDocument();
      });
   });
});
