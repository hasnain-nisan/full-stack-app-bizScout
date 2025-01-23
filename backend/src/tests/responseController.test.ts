import request from 'supertest';
import app from '../app';
import ResponseService from '../services/responseService';

jest.mock('../services/responseService');


describe('ResponseController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and save data successfully', async () => {
    // Mock ResponseService.fetchAndSaveResponse to resolve successfully
    (ResponseService.fetchAndSaveResponse as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).post('/api/fetch');

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Data fetched and saved successfully');
    expect(ResponseService.fetchAndSaveResponse).toHaveBeenCalled();
  });

  it('should return historical data successfully', async () => {
    const mockData = [{ requestPayload: {}, response: {}, timestamp: `${new Date()}` }];
    // Mock ResponseService.getHistoricalData to return mock data
    (ResponseService.getHistoricalData as jest.Mock).mockResolvedValue(mockData);

    const response = await request(app).get('/api/data');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
    expect(ResponseService.getHistoricalData).toHaveBeenCalled();
  });

  it('should handle errors in fetching and saving data', async () => {
    // Mock ResponseService.fetchAndSaveResponse to throw an error
    (ResponseService.fetchAndSaveResponse as jest.Mock).mockRejectedValue(new Error('Service Error'));

    const response = await request(app).post('/api/fetch');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error in fetching and saving response');
  });

  it('should handle errors in fetching historical data', async () => {
    // Mock ResponseService.getHistoricalData to throw an error
    (ResponseService.getHistoricalData as jest.Mock).mockRejectedValue(new Error('Service Error'));

    const response = await request(app).get('/api/data');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error fetching historical data');
  });
});
