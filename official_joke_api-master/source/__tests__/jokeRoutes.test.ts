import request from "supertest";
import express from "express";
import jokeRoutes from "../routes/jokeRoutes";
import { cache } from "../cache";
import * as jokeDb from "../db/jokes";

jest.mock("../db/jokes", () => ({
  randomJoke: jest.fn(),
  randomTen: jest.fn(),
  randomSelect: jest.fn(),
  jokeByType: jest.fn(),
  jokeById: jest.fn(),
  addJoke: jest.fn(),
  updateJoke: jest.fn(),
  searchJokes: jest.fn(),
  rateJoke: jest.fn(),
  getCount: jest.fn(),
  getTypes: jest.fn(),
}));

describe("Joke Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/", jokeRoutes);
    cache.clear();
    jest.clearAllMocks();
  });

  describe("GET /random_joke", () => {
    const mockJoke = {
      id: "123",
      type: "programming",
      setup: "Why do programmers prefer dark mode?",
      punchline: "Because light attracts bugs!",
    };

    it("should return a random joke", async () => {
      (jokeDb.randomJoke as jest.Mock).mockResolvedValue(mockJoke);

      const response = await request(app).get("/random_joke");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockJoke);
      expect(jokeDb.randomJoke).toHaveBeenCalledTimes(1);
    });

    it("should cache the response", async () => {
      (jokeDb.randomJoke as jest.Mock).mockResolvedValue(mockJoke);

      await request(app).get("/random_joke");
      await request(app).get("/random_joke");

      expect(jokeDb.randomJoke).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /jokes/random/:num", () => {
    const mockJokes = [
      { id: "1", type: "general", setup: "Joke 1", punchline: "Punchline 1" },
      { id: "2", type: "general", setup: "Joke 2", punchline: "Punchline 2" },
    ];

    beforeEach(() => {
      (jokeDb.getCount as jest.Mock).mockResolvedValue(10);
      (jokeDb.randomSelect as jest.Mock).mockResolvedValue(mockJokes);
    });

    it("should return the requested number of random jokes", async () => {
      const response = await request(app).get("/jokes/random/2");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockJokes);
      expect(jokeDb.randomSelect).toHaveBeenCalledWith(2);
    });

    it("should return an error if number is not valid", async () => {
      const response = await request(app).get("/jokes/random/abc");

      expect(response.status).toBe(200);
      expect(response.text).toContain("not a number");
    });

    it("should return an error if number exceeds available jokes", async () => {
      const response = await request(app).get("/jokes/random/20");

      expect(response.status).toBe(200);
      expect(response.text).toContain("exceeds the number of jokes");
    });
  });

  describe("POST /jokes/:id/rate", () => {
    const mockJoke = {
      id: "123",
      type: "programming",
      setup: "Test joke",
      punchline: "Test punchline",
      rating: 4.5,
      votes: 10,
    };

    beforeEach(() => {
      (jokeDb.rateJoke as jest.Mock).mockResolvedValue(mockJoke);
    });

    it("should rate a joke and return updated joke", async () => {
      const response = await request(app)
        .post("/jokes/123/rate")
        .send({ value: 5 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockJoke);
      expect(jokeDb.rateJoke).toHaveBeenCalledWith("123", 5);
    });

    it("should return 400 if rating value is invalid", async () => {
      const response = await request(app)
        .post("/jokes/123/rate")
        .send({ value: "invalid" });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Invalid rating value");
    });

    it("should return 404 if joke not found", async () => {
      (jokeDb.rateJoke as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/jokes/999/rate")
        .send({ value: 5 });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain("joke not found");
    });
  });

  describe("GET /types", () => {
    const mockTypes = ["general", "programming", "knock-knock", "dad"];

    beforeEach(() => {
      (jokeDb.getTypes as jest.Mock).mockResolvedValue(mockTypes);
    });

    it("should return all joke types", async () => {
      const response = await request(app).get("/types");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTypes);
      expect(jokeDb.getTypes).toHaveBeenCalledTimes(1);
    });

    it("should cache the types", async () => {
      await request(app).get("/types");
      await request(app).get("/types");

      expect(jokeDb.getTypes).toHaveBeenCalledTimes(1);
    });
  });
});
