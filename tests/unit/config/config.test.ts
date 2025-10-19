import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.mock("dotenv", () => ({
  __esModule: true, 
  default: {
    config: jest.fn(),
  },
}));

const validateMock = jest.fn();

jest.mock("../../../src/validation/env.validation.ts", () => ({
  __esModule: true,
  envSchema: { validate: validateMock },
}));


beforeEach(() => {
  jest.resetModules();
});

describe("Config Module", () => {
  it("should export the correct environment variables when validation passes", async () => {
    const mockEnv = {
      PORT: "4000",
      MONGO_URI: "mongodb://localhost:27017/testdb",
      NODE_ENV: "development",
    };

    validateMock.mockReturnValue({ value: mockEnv, error: null });

    const { config } = await import("../../../src/config/config.ts");

    expect(config.port).toBe("4000");
    expect(config.dbConnection).toBe("mongodb://localhost:27017/testdb");
    expect(config.nodeEnv).toBe("development");
  });

  it("should log an error message if validation fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    validateMock.mockReturnValue({
      value: {},
      error: { message: "Missing required environment variables" },
    });

    await import("../../../src/config/config.ts");

    expect(consoleSpy).toHaveBeenLastCalledWith(
      "Config validation error:",
      "Missing required environment variables"
    );

    consoleSpy.mockRestore();
  });
});
