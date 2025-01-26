//userRoutes.test.js
const User = require("../../../models/userModel");

jest.mock("../../../models/UserModel");

describe("User Model", () => {
  it("should create a new user", async () => {
    const mockUser = { email: "test@example.com", password: "password123" };
    
    User.create.mockResolvedValue(mockUser);  // Mock create method
    
    const result = await User.create(mockUser);
    expect(result).toEqual(mockUser);
    expect(User.create).toHaveBeenCalledWith(mockUser);
  });

  it("should find a user by email", async () => {
    const mockUser = { email: "test@example.com", password: "password123" };

    User.findOne.mockResolvedValue(mockUser);  // Mock findOne method

    const result = await User.findOne({ email: "test@example.com" });
    expect(result).toEqual(mockUser);
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  });
});
