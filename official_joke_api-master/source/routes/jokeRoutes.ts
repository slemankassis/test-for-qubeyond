import { Router, Request, Response, NextFunction } from "express";
import {
  types,
  randomJoke,
  randomTen,
  randomSelect,
  jokeByType,
  jokeById,
  count,
} from "../db";

const router = Router();

// Root endpoint - instructions
router.get("/", (req: Request, res: Response) => {
  res.send(
    "Try /random_joke, /random_ten, /jokes/random, or /jokes/ten , /jokes/random/<any-number>"
  );
});

// Health check endpoint
router.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// Get a random joke
router.get("/random_joke", (req: Request, res: Response) => {
  res.json(randomJoke());
});

// Get 10 random jokes
router.get("/random_ten", (req: Request, res: Response) => {
  res.json(randomTen());
});

// Alternate endpoint for random joke
router.get("/jokes/random", (req: Request, res: Response) => {
  res.json(randomJoke());
});

// Get N random jokes
router.get(
  "/jokes/random/:num",
  (req: Request, res: Response, next: NextFunction) => {
    let num: number;
    try {
      num = parseInt(req.params.num);
      if (!num) {
        res.send("The passed path is not a number.");
      } else {
        if (num > count) {
          res.send(`The passed path exceeds the number of jokes (${count}).`);
        } else {
          res.json(randomSelect(num));
        }
      }
    } catch (e) {
      return next(e);
    }
  }
);

// Alternate endpoint for 10 random jokes
router.get("/jokes/ten", (req: Request, res: Response) => {
  res.json(randomTen());
});

// Get a random joke of a specific type
router.get("/jokes/:type/random", (req: Request, res: Response) => {
  res.json(jokeByType(req.params.type, 1));
});

// Get 10 jokes of a specific type
router.get("/jokes/:type/ten", (req: Request, res: Response) => {
  res.json(jokeByType(req.params.type, 10));
});

// Get a joke by ID
router.get("/jokes/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const joke = jokeById(+id);
    if (!joke) return next({ statusCode: 404, message: "joke not found" });
    return res.json(joke);
  } catch (e) {
    return next(e);
  }
});

// Get all available joke types
router.get("/types", (req: Request, res: Response) => {
  res.json(types);
});

export default router;
