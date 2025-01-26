const mongoose = require("mongoose");

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect after all tests
  await mongoose.connection.close();
});
