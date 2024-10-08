import supertest from 'supertest';
import app, { init, close } from '@/app';

beforeAll(async () => {
  await init();
});

afterAll(async () => {
  await close();
});

const server = supertest(app);

describe('GET /health', () => {
  it('should respond with status 200 with OK! text', async () => {
    const response = await server.get('/health');

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK!');
  });
});
