// jest.setup.js
require('dotenv').config({ path: '.env.test' });

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
  }));
  