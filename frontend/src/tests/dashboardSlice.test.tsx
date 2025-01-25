import dashboardReducer, {
   fetchData,
   addNewData,
} from '../store/dashboardSlice';
import modalReducer from '../store/modalSlice';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { configureStore } from '@reduxjs/toolkit';
import { act } from 'react';

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

describe('Dashboard Slice - Initial State', () => {
   it('should return the initial state', () => {
      const initialState = {
         data: [],
         loading: false,
         error: null,
         totalRequests: 0,
         postRequests: 0,
         highPriorityRequests: 0,
      };

      expect(dashboardReducer(undefined, { type: 'undefined' })).toEqual(
         initialState
      );
   });
});

describe('Dashboard Slice - addNewData Reducer', () => {
   it('should add a new data row and update statistics', () => {
      const initialState = {
         data: [],
         loading: false,
         error: null,
         totalRequests: 0,
         postRequests: 0,
         highPriorityRequests: 0,
      };

      const newRow = {
         _id: '123',
         timestamp: '2025-01-01T10:00:00Z',
         requestPayload: {
            requestId: 'req-123',
            event: { type: 'API', url: '/example', method: 'POST' },
            metadata: { environment: 'prod', priority: 'high' },
         },
         response: {
            json: { event: { body: { action: 'create' } } },
            method: 'POST',
            origin: 'localhost',
         },
      };

      const updatedState = dashboardReducer(initialState, addNewData(newRow));

      expect(updatedState.data).toHaveLength(1);
      expect(updatedState.totalRequests).toBe(1);
      expect(updatedState.postRequests).toBe(1);
      expect(updatedState.highPriorityRequests).toBe(1);
   });
});

const mockAxios = new MockAdapter(axios);

describe('Dashboard Slice - fetchData Thunk', () => {
   afterEach(() => {
      mockAxios.reset();
   });

   it('should dispatch fulfilled actions and update state on success', async () => {
      const store = createMockStore({
         dashboard: {
            data: [],
            loading: false,
            error: null,
            totalRequests: 0,
            postRequests: 0,
            highPriorityRequests: 0,
         },
      });

      await act(async () => {
         mockAxios.onGet('/data').reply(200);
         // await store.dispatch(fetchData() as AsyncThunkAction);
         await store.dispatch(fetchData() as unknown as ReturnType<typeof fetchData>);
      });

      const state = store.getState().dashboard;

      expect(state.data.length).toBeGreaterThan(0);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
   });
});
