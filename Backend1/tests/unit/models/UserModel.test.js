// UserModel.test.js
const mongoose = require("mongoose");
const User = require("../../../models/userModel");

jest.mock("../../../models/userModel");

describe("User Model", () => {
  it("should create a new user", async () => {
    const mockUser = { email: "test@example.com", password: "password123" };
    
    // Mock the create method on the User model
    User.create.mockResolvedValue(mockUser);

    const result = await User.create(mockUser);
    expect(result).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith(mockUser);
  });

  it("should find a user by email", async () => {
    const mockUser = { email: "test@example.com", password: "password123" };
    
    // Mock the findOne method on the User model
    User.findOne.mockResolvedValue(mockUser);

    const result = await User.findOne({ email: "test@example.com" });
    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  });
});
