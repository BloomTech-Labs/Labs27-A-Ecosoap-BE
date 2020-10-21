const request = require('supertest');
const express = require('express');
const Profiles = require('../../api/profile/profileService');
const profileRouter = require('../../api/profile/profileRouter');
const server = express();
server.use(express.json());

jest.mock('../../api/profile/profileService');
// mock the auth middleware completely
jest.mock('../../api/middleware/authRequired', () => () =>
  jest.fn((req, res, next) => {
    req.profile = { id: 'something' };
    next();
  })
);

describe('profiles router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use(['/profile', '/profiles'], profileRouter);
    jest.clearAllMocks();
  });

  describe('GET /profiles', () => {
    it('should return 200', async () => {
      Profiles.findAllBuyers.mockResolvedValue([]);
      const res = await request(server).get('/profiles');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(Profiles.findAllBuyers.mock.calls.length).toBe(1);
    });
  });

  describe('GET /profiles/:id', () => {
    it('should return 200 when profile found', async () => {
      Profiles.findBuyerById.mockResolvedValue({
        id: 'd376de0577681ca93614',
        name: 'Bob Smith',
        email: 'bob@example.com',
      });
      const res = await request(server).get('/profiles/d376de0577681ca93614');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Bob Smith');
      expect(Profiles.findBuyerById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no user found', async () => {
      Profiles.findBuyerById.mockResolvedValue();
      const res = await request(server).get('/profiles/d376de0577681ca93614');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ProfileNotFound');
    });
  });

  describe('POST /profile', () => {
    it('should return 200 when profile is created', async () => {
      const profile = {
        name: 'Louie Smith',
        email: 'louie@example.com',
        avatarUrl:
          'https://s3.amazonaws.com/uifaces/faces/twitter/hermanobrother/128.jpg',
      };
      Profiles.findBuyerById.mockResolvedValue(undefined);
      Profiles.createBuyer.mockResolvedValue(
        Object.assign({ id: 'd376de0577681ca93614' }, profile)
      );
      const res = await request(server).post('/profile').send(profile);

      expect(res.status).toBe(200);
      expect(res.body.profile.id).toBe('d376de0577681ca93614');
      expect(Profiles.createBuyer.mock.calls.length).toBe(1);
    });
  });

  describe('PUT /profile', () => {
    it('should return 200 when profile is created', async () => {
      const profile = {
        id: 'd376de0577681ca93614',
        name: 'Louie Smith',
        email: 'louie@example.com',
        avatarUrl:
          'https://s3.amazonaws.com/uifaces/faces/twitter/hermanobrother/128.jpg',
      };
      Profiles.findBuyerById.mockResolvedValue(profile);
      Profiles.updateBuyer.mockResolvedValue(profile);

      const res = await request(server).put('/profile').send(profile);
      expect(res.status).toBe(200);
      expect(res.body.profile.name).toBe('Louie Smith');
      expect(Profiles.updateBuyer.mock.calls.length).toBe(1);
    });
  });
});
