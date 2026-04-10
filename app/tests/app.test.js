const request = require('supertest');
const express = require('express');

// Simulamos la app para no interferir con el servidor real
const app = express();
app.get('/health', (req, res) => res.status(200).send('OK'));

describe('Pruebas de la API', () => {
    
    // Test 1: Verificar que el endpoint de salud responda 200
    test('El endpoint /health debería retornar 200 OK', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('OK');
    });

    // Test 2: Simulación de una lógica simple (Prueba Unitaria)
    test('Validación de suma (Prueba lógica básica)', () => {
        const suma = (a, b) => a + b;
        expect(suma(2, 2)).toBe(4);
    });
});