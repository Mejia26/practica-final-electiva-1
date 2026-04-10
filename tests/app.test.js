const request = require('supertest');
const app = require('../server');

describe('Pruebas de API Items', () => {
  // Integración: Flujo completo de POST y GET
  test('Debería crear un nuevo item y listarlo', async () => {
    const resPost = await request(app)
      .post('/api/items')
      .send({ name: 'Test Item' });
    
    expect(resPost.statusCode).toEqual(201);
    expect(resPost.body.name).toBe('Test Item');

    const resGet = await request(app).get('/api/items');
    expect(resGet.statusCode).toEqual(200);
    expect(resGet.body.length).toBeGreaterThan(0);
  });

  // Unitario (Lógica de validación)
  test('Debería fallar si no se envía nombre', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({});
    expect(res.statusCode).toEqual(400);
  });
});