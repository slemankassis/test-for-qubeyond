import { Router, Request, Response, NextFunction } from "express";
import {
  types,
  randomJoke,
  randomTen,
  randomSelect,
  jokeByType,
  jokeById,
  addJoke,
  updateJoke,
  count,
  Joke,
} from "../db";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send(
    "Try /random_joke, /random_ten, /jokes/random, or /jokes/ten , /jokes/random/<any-number>",
  );
});

router.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

router.get("/random_joke", (req: Request, res: Response) => {
  res.json(randomJoke());
});

router.get("/random_ten", (req: Request, res: Response) => {
  res.json(randomTen());
});

router.get("/jokes/random", (req: Request, res: Response) => {
  res.json(randomJoke());
});

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
  },
);

router.get("/jokes/ten", (req: Request, res: Response) => {
  res.json(randomTen());
});

router.get("/jokes/:type/random", (req: Request, res: Response) => {
  res.json(jokeByType(req.params.type, 1));
});

router.get("/jokes/:type/ten", (req: Request, res: Response) => {
  res.json(jokeByType(req.params.type, 10));
});

router.get("/jokes/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const joke = jokeById(id);
    if (!joke) return next({ statusCode: 404, message: "joke not found" });
    return res.json(joke);
  } catch (e) {
    return next(e);
  }
});

router.post("/jokes", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, setup, punchline } = req.body;

    if (!type || !setup || !punchline) {
      return next({
        statusCode: 400,
        message: "Missing required fields: type, setup, punchline",
      });
    }

    const newJoke: Joke = { type, setup, punchline };
    const addedJoke = addJoke(newJoke);

    return res.status(201).json(addedJoke);
  } catch (e) {
    return next(e);
  }
});

router.put("/jokes/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { type, setup, punchline } = req.body;

    if (!type || !setup || !punchline) {
      return next({
        statusCode: 400,
        message: "Missing required fields: type, setup, punchline",
      });
    }

    const jokeUpdate: Joke = { type, setup, punchline };
    const updatedJoke = updateJoke(id, jokeUpdate);

    if (!updatedJoke) {
      return next({ statusCode: 404, message: "joke not found" });
    }

    return res.json(updatedJoke);
  } catch (e) {
    return next(e);
  }
});

router.get("/types", (req: Request, res: Response) => {
  res.json(types);
});

export default router;
