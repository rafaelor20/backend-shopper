import supertest from 'supertest';
import { prisma } from '@/config'; 
import app, { init, close } from '@/app';
import { water, energy } from '../factories/images';

const server = supertest(app);

beforeAll(async () => {
    await init();
    await prisma.bill.deleteMany({}); // Limpa os registros de medições
  });
  
  beforeEach(async () => {
    await prisma.bill.deleteMany({}); // Limpa os registros de medições
  });
  
  afterAll(async () => {
    await close();
  });
  

describe('POST /upload', () => {

    test('Deve retornar 400 se os dados enviados forem inválidos', async () => {
        const response = await server
            .post('/upload')
            .send({
                image: 'invalid_base64_string', // Base64 inválido
                customer_code: 123, // Deve ser string
                measure_datetime: 'invalid-date',
                measure_type: 'INVALID_TYPE'
            });
        
        expect(response.status).toBe(400);
        expect(response.body.error_code).toBe('INVALID_DATA');
    });

    test('Deve retornar 409 se já houver uma leitura no mês para esse tipo', async () => {
        // Primeiro, cria uma leitura no banco de dados de teste
        await prisma.bill.create({
            data: {
                customer_code: 'CUSTOMER123',
                measure_datetime: new Date('2024-08-01T12:00:00Z'),
                measure_type: 'GAS',
                measure_value: 123,
                measure_uuid: 'some-uuid',
                has_confirmed: true,
                image_url: 'https://example.com/image.png'
            }
        });
    
        const response = await server
            .post('/upload')
            .send({
                image: energy,
                customer_code: 'CUSTOMER123',
                measure_datetime: '2024-08-15T12:00:00Z',
                measure_type: 'GAS'
            });
        
        expect(response.status).toBe(409);
        expect(response.body.error_code).toBe('DOUBLE_REPORT');
    }, 60000);

    test('Deve retornar 200 e a leitura extraída da imagem', async () => {
        const response = await server.post('/upload')
            .send({
                image: water, // Base64 de exemplo
                customer_code: 'CUSTOMER123',
                measure_datetime: '2024-08-29T12:00:00Z',
                measure_type: 'WATER'
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('image_url');
        expect(response.body).toHaveProperty('measure_value');
        expect(response.body).toHaveProperty('measure_uuid');
    }, 60000);
});
