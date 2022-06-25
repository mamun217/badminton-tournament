import request from 'supertest';
import app from '../application';

test('application is running as expected', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toEqual(200);
});
