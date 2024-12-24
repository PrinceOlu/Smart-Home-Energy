//userController.test.js
const { registerUser, loginUser } = require("../../../controller/userController");
const User = require("../../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../../models/UserModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  
  describe("registerUser", () => {
    it("should register a user successfully", async () => {
      const req = {
        body: { email: "test@example.com", password: "password123" }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      
      const mockUser = { email: "test@example.com", password: "hashedPassword" };
      User.create.mockResolvedValue(mockUser);  // Mock User creation

      bcrypt.hash.mockResolvedValue("hashedPassword");  // Mock password hashing

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: mockUser,
      });
    });

    it("should handle errors during registration", async () => {
      const req = {
        body: { email: "test@example.com", password: "password123" }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.create.mockRejectedValue(new Error("Registration failed"));  // Simulate an error

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error: Registration failed",
      });
    });
  });

  describe("loginUser", () => {
    it("should return a token for valid credentials", async () => {
      const req = {
        body: { email: "test@example.com", password: "password123" }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = { _id: "123", email: "test@example.com", password: "hashedPassword" };
      User.findOne.mockResolvedValue(mockUser);  // Mock finding user by email
      bcrypt.compare.mockResolvedValue(true);  // Mock password comparison

      jwt.sign.mockReturnValue("mockToken");  // Mock token generation

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        Token: "mockToken",
        message: "User logged in successfully",
      });
    });

    it("should return error for invalid credentials", async () => {
      const req = {
        body: { email: "test@example.com", password: "wrongPassword" }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = { _id: "123", email: "test@example.com", password: "hashedPassword" };
      User.findOne.mockResolvedValue(mockUser);  // Mock finding user by email
      bcrypt.compare.mockResolvedValue(false);  // Simulate password mismatch

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });
  });
});
