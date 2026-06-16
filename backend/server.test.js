const request = require('supertest');
const app = require('./server');

describe('API Endpoints', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Test',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
    });

    it('should generate AI description', async () => {
        const res = await request(app)
            .post('/api/generate-description')
            .send({ topic: 'Docker' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('description');
        expect(res.body.description).toContain('Docker');
    });
});
