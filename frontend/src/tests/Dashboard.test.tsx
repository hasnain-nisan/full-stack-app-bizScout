import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer, { addNewData, fetchData } from '../store/dashboardSlice';
import modalReducer from '../store/modalSlice';
import Dashboard from '../pages/Dashboard';
import { useSocket } from '../hooks/useSocket';
import { RootState } from '../store/store'; // Adjust path if necessary
import React from 'react';
import '@testing-library/jest-dom';

// Mock the useSocket hook to simulate real-time updates
jest.mock('../hooks/useSocket', () => ({
  useSocket: jest.fn(),
}));

const mockSocketData = [
  {
    _id: '1',
    timestamp: '2025-01-23T16:16:38Z',
    requestPayload: {
      requestId: '1',
      event: {
        type: 'request',
        url: '/api/test',
        method: 'POST',
      },
      metadata: {
        environment: 'production',
        priority: 'high',
      },
    },
    response: {
      json: {
        event: {
          body: {
            action: 'test-action',
          },
        },
      },
      method: 'POST',
      origin: 'localhost',
    },
  },
];

const createMockStore = () => {
  return configureStore({
    reducer: {
      modal: modalReducer,
      dashboard: dashboardReducer, // Add other reducers as needed
    }
  });
};

describe('Dashboard Component', () => {
  let store;
  beforeEach(() => {
    store = createMockStore();

    // Mock the useSocket hook to simulate real-time data
    (useSocket as jest.Mock).mockReturnValue(mockSocketData);
  });

  it('renders loading spinner when data is being fetched', () => {
    store = createMockStore();

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    // Check if loading spinner is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading data, please wait...')).toBeInTheDocument();
  });

  it('displays data when it has been fetched', async () => {
    store = createMockStore();

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    // Check if data appears in the table
    expect(screen.getByText((content, element) => {
      return element?.textContent === "Requests Table";
    })).toBeInTheDocument();
    expect(screen.getByText('/api/test')).toBeInTheDocument();
    expect(screen.getByText('POST Requests')).toBeInTheDocument();
    expect(screen.getByText('High Priority Requests')).toBeInTheDocument();
  });

  // it('updates with real-time data', async () => {
  //   store = createMockStore({
  //     dashboard: {
  //       data: [],
  //       loading: false,
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

  //   // Simulate real-time data update
  //   expect(store.getState().dashboard.totalRequests).toBe(1);
  //   expect(store.getState().dashboard.postRequests).toBe(1);
  //   expect(store.getState().dashboard.highPriorityRequests).toBe(1);
  // });
});
