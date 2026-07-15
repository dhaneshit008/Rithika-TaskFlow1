const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../index');

const authPayload = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'secret123',
};

test('registers a new user and returns a token', async () => {
  const response = await request(app).post('/api/register').send(authPayload);

  assert.equal(response.status, 201);
  assert.ok(response.body.token);
  assert.equal(response.body.user.email, authPayload.email);
});

test('logs in an existing user', async () => {
  const response = await request(app).post('/api/login').send({
    email: authPayload.email,
    password: authPayload.password,
  });

  assert.equal(response.status, 200);
  assert.ok(response.body.token);
});

test('creates and lists tasks for an authenticated user', async () => {
  const loginResponse = await request(app).post('/api/login').send({
    email: authPayload.email,
    password: authPayload.password,
  });

  const token = loginResponse.body.token;
  const createResponse = await request(app)
    .post('/api/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Write unit tests',
      description: 'Add backend coverage',
      priority: 'High',
      dueDate: '2026-08-01',
    });

  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.title, 'Write unit tests');

  const listResponse = await request(app)
    .get('/api/tasks')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(listResponse.status, 200);
  assert.ok(listResponse.body.some((task) => task.title === 'Write unit tests'));
});
