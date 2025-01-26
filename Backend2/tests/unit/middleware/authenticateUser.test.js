//authenticateUser.test.js
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../../../Middleware/authenticateUser"); // Adjust the path to your middleware

// Mocking the JWT verification function
jest.mock("jsonwebtoken");

describe("authenticateUser Middleware", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(require("cookie-parser")());  // If using cookies for the token
    app.post(
      "/protected-route",
      authenticateUser,
      (req, res) => {
        res.status(200).json({ message: "Access granted", user: req.user });
      }
    );
  });

  it("should allow access with a valid token", async () => {
    // Mocking the behavior of JWT.verify to return a decoded user
    const mockDecoded = { userId: "123", email: "test@example.com" };
    jwt.verify.mockReturnValue(mockDecoded);

    // Simulate a request with a valid token in the cookie
    const res = await request(app)
      .post("/protected-route")
      .set("Cookie", "auth_token=valid_token");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Access granted");
    expect(res.body.user).toEqual(mockDecoded);
  });

  it("should return 401 if no token is provided", async () => {
    // Simulate a request with no token in the cookies
    const res = await request(app).post("/protected-route");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 401 if an invalid token is provided", async () => {
    // Mocking JWT verification to throw an error (invalid token)
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Simulate a request with an invalid token
    const res = await request(app)
      .post("/protected-route")
      .set("Cookie", "auth_token=invalid_token");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});
