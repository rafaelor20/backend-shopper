import request from 'supertest';
import app from '../../src/app';
import { prisma } from '@/config'; 

describe('POST /upload', () => {
    beforeAll(async () => {
        // Configurações necessárias antes de rodar os testes, como seed do banco de dados de teste
        await prisma.measurement.deleteMany(); // Limpa os registros de medições
    });

    afterAll(async () => {
        // Fechar as conexões com o banco de dados após todos os testes
        await prisma.$disconnect();
    });

    test('Deve retornar 200 e a leitura extraída da imagem', async () => {
        const response = await request(app)
            .post('/upload')
            .send({
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // Base64 de exemplo
                customer_code: 'CUSTOMER123',
                measure_datetime: '2024-08-29T12:00:00Z',
                measure_type: 'WATER'
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('image_url');
        expect(response.body).toHaveProperty('measure_value');
        expect(response.body).toHaveProperty('measure_uuid');
    });

    test('Deve retornar 400 se os dados enviados forem inválidos', async () => {
        const response = await request(app)
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
        await prisma.measurement.create({
            data: {
                customer_code: 'CUSTOMER123',
                measure_datetime: new Date('2024-08-01T12:00:00Z'),
                measure_type: 'GAS',
                measure_value: 123
            }
        });

        const response = await request(app)
            .post('/upload')
            .send({
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
                customer_code: 'CUSTOMER123',
                measure_datetime: '2024-08-15T12:00:00Z',
                measure_type: 'GAS'
            });
        
        expect(response.status).toBe(409);
        expect(response.body.error_code).toBe('DOUBLE_REPORT');
    });
});
