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
  searchJokes,
  rateJoke,
  RatingData,
  getCount,
  getTypes,
} from "../db/jokes";
import { cache } from "../cache";

const router = Router();

// Caching middleware
const cacheMiddleware = (ttl = 300000) => {
  // 5 minutes by default
  return (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = `${req.originalUrl || req.url}`;

    // Check if we have a cached response for this URL
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for: ${cacheKey}`);
      return res.json(cachedData);
    }

    // Store the original res.json method
    const originalJson = res.json;

    // Override the res.json method to cache the response
    res.json = function (data) {
      // Store in cache before sending
      cache.set(cacheKey, data, ttl);

      // Call the original method
      return originalJson.call(this, data);
    };

    next();
  };
};

// Middleware to clear cache when data is modified
const invalidateCache = (pattern: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // After response is sent, invalidate relevant cache entries
    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const stats = cache.stats();
        stats.keys.forEach((key) => {
          if (key.includes(pattern)) {
            cache.del(key);
          }
        });
        console.log(`Cache invalidated for pattern: ${pattern}`);
      }
    });

    next();
  };
};

router.get("/", (req: Request, res: Response) => {
  res.send(
    "Try /random_joke, /random_ten, /jokes/random, /jokes/search?q=term, or /jokes/ten, /jokes/random/<any-number>",
  );
});

router.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

router.get(
  "/random_joke",
  cacheMiddleware(60000), // Cache for 1 minute
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joke = await randomJoke();
      res.json(joke);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/random_ten",
  cacheMiddleware(60000), // Cache for 1 minute
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jokes = await randomTen();
      res.json(jokes);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/jokes/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return next({
          statusCode: 400,
          message: "Missing search query. Use ?q=searchterm",
        });
      }

      const results = await searchJokes(query);
      return res.json(results);
    } catch (e) {
      return next(e);
    }
  },
);

router.get(
  "/jokes/random",
  cacheMiddleware(60000), // Cache for 1 minute
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joke = await randomJoke();
      res.json(joke);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/jokes/random/:num",
  cacheMiddleware(60000), // Cache for 1 minute
  async (req: Request, res: Response, next: NextFunction) => {
    let num: number;
    try {
      num = parseInt(req.params.num);
      if (!num) {
        res.send("The passed path is not a number.");
      } else {
        const jokeCount = await getCount();
        if (num > jokeCount) {
          res.send(
            `The passed path exceeds the number of jokes (${jokeCount}).`,
          );
        } else {
          const jokes = await randomSelect(num);
          res.json(jokes);
        }
      }
    } catch (e) {
      return next(e);
    }
  },
);

router.get(
  "/jokes/ten",
  cacheMiddleware(60000), // Cache for 1 minute
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jokes = await randomTen();
      res.json(jokes);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/jokes/:type/random",
  cacheMiddleware(60000), // Cache for 1 minute
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jokes = await jokeByType(req.params.type, 1);
      res.json(jokes);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/jokes/:type/ten",
  cacheMiddleware(60000), // Cache for 1 minute
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jokes = await jokeByType(req.params.type, 10);
      res.json(jokes);
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  "/jokes/:id/rate",
  invalidateCache("/jokes"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { value } = req.body as RatingData;

      if (
        value === undefined ||
        typeof value !== "number" ||
        value < 0 ||
        value > 5
      ) {
        return next({
          statusCode: 400,
          message: "Invalid rating value. Must be a number between 0 and 5.",
        });
      }

      const joke = await rateJoke(id, value);

      if (!joke) {
        return next({ statusCode: 404, message: "joke not found" });
      }

      return res.json(joke);
    } catch (e) {
      return next(e);
    }
  },
);

router.get(
  "/jokes/:id",
  cacheMiddleware(300000), // Cache for 5 minutes
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const joke = await jokeById(id);
      if (!joke) return next({ statusCode: 404, message: "joke not found" });
      return res.json(joke);
    } catch (e) {
      return next(e);
    }
  },
);

router.post(
  "/jokes",
  invalidateCache("/jokes"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, setup, punchline } = req.body;

      if (!type || !setup || !punchline) {
        return next({
          statusCode: 400,
          message: "Missing required fields: type, setup, punchline",
        });
      }

      const newJoke: Joke = { type, setup, punchline };
      const addedJoke = await addJoke(newJoke);

      return res.status(201).json(addedJoke);
    } catch (e) {
      return next(e);
    }
  },
);

router.put(
  "/jokes/:id",
  invalidateCache("/jokes"),
  async (req: Request, res: Response, next: NextFunction) => {
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
      const updatedJoke = await updateJoke(id, jokeUpdate);

      if (!updatedJoke) {
        return next({ statusCode: 404, message: "joke not found" });
      }

      return res.json(updatedJoke);
    } catch (e) {
      return next(e);
    }
  },
);

router.get(
  "/types",
  cacheMiddleware(600000), // Cache for 10 minutes
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jokeTypes = await getTypes();
      res.json(jokeTypes);
    } catch (e) {
      next(e);
    }
  },
);

export default router;
