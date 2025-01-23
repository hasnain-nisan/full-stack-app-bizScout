import axios from 'axios';
import ResponseDAO from '../daos/responseDAO';
import ResponseService from '../services/responseService';
import { AppError } from '../utils/appError';
import { io } from '../server';

// Mock external modules and dependencies
jest.mock('axios');
jest.mock('../daos/responseDAO');
jest.mock('../server', () => ({
  io: { emit: jest.fn() },
}));

describe('ResponseService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and save response successfully', async () => {
    // Mock the axios POST request to return mock data
    const mockResponse = { data: { key: 'value' } };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    // Mock ResponseDAO.saveResponse to resolve successfully
    (ResponseDAO.saveResponse as jest.Mock).mockResolvedValue(undefined);

    await ResponseService.fetchAndSaveResponse();

    expect(axios.post).toHaveBeenCalledWith(
      'https://httpbin.org/anything',
      expect.any(Object)
    );
    expect(ResponseDAO.saveResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        requestPayload: expect.any(Object),
        response: mockResponse.data,
        timestamp: expect.any(Date),
      })
    );
    expect(io.emit).toHaveBeenCalledWith(
      'newData',
      expect.objectContaining({
        requestPayload: expect.any(Object),
        response: mockResponse.data,
        timestamp: expect.any(Date),
      })
    );
  });

  it('should throw an error if fetching and saving fails', async () => {
    // Simulate an error in axios
    (axios.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(ResponseService.fetchAndSaveResponse()).rejects.toThrow(
      new AppError('Error in fetching and saving response', 500)
    );
  });

  it('should return historical data successfully', async () => {
    const mockData = [{ requestPayload: {}, response: {}, timestamp: new Date() }];
    (ResponseDAO.getAllResponses as jest.Mock).mockResolvedValue(mockData);

    const data = await ResponseService.getHistoricalData();

    expect(data).toEqual(mockData);
    expect(ResponseDAO.getAllResponses).toHaveBeenCalled();
  });

  it('should throw an error if fetching historical data fails', async () => {
    (ResponseDAO.getAllResponses as jest.Mock).mockRejectedValue(new Error('Database Error'));

    await expect(ResponseService.getHistoricalData()).rejects.toThrow(
      new AppError('Error fetching historical data', 500)
    );
  });
});
