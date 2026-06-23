import request from 'supertest';
import app from '../app';

describe('Backend API - Project CI', () => {
  describe('GET /', () => {
    it('responde 200 con mensaje de bienvenida', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /health', () => {
    it('responde 200 con status OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('container');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /tasks', () => {
    it('rechaza body sin title con 400', async () => {
      const res = await request(app).post('/tasks').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rechaza title vacío con 400', async () => {
      const res = await request(app).post('/tasks').send({ title: '   ' });
      expect(res.status).toBe(400);
    });
  });
});
