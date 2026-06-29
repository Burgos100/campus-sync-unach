// Set test environment before requiring anything else
process.env.NODE_ENV = "test";

const request = require("supertest");

jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: () => "Mocked AI description for Docker",
            },
          }),
        }),
      };
    }),
  };
});

jest.mock("./db", () => ({
  pool: {
    query: jest.fn((query) => {
      if (query.includes("INSERT INTO users")) {
        return Promise.resolve([[{ insertId: 1 }]]);
      }
      if (query.includes("SELECT * FROM users")) {
        return Promise.resolve([
          [
            {
              id: 1,
              name: "Test",
              email: "test@example.com",
              role: "Alumno",
            },
          ],
        ]);
      }
      return Promise.resolve([[]]);
    }),
  },
  initDB: jest.fn(),
}));

const app = require("./server");

describe("API Endpoints", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should generate AI description", async () => {
    const res = await request(app)
      .post("/api/generate-description")
      .send({ topic: "Docker" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("description");
  }, 10000);
});
