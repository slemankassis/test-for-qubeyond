import { v4 as uuidv4 } from "uuid";
import pool from "./connection";

export interface Joke {
  id?: string;
  type: string;
  setup: string;
  punchline: string;
  rating?: number;
  votes?: number;
}

export interface RatingData {
  value: number;
}

// Get all joke types
export const getTypes = async (): Promise<string[]> => {
  const result = await pool.query("SELECT DISTINCT type FROM jokes");
  return result.rows.map((row: any) => row.type);
};

// Get a random joke
export const randomJoke = async (): Promise<Joke> => {
  const result = await pool.query(
    "SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1",
  );
  const joke = result.rows[0];
  return {
    id: joke.joke_id,
    type: joke.type,
    setup: joke.setup,
    punchline: joke.punchline,
    rating: joke.rating,
    votes: joke.votes,
  };
};

// Get N random jokes
export const randomN = async (n: number): Promise<Joke[]> => {
  const result = await pool.query(
    `SELECT * FROM jokes ORDER BY RANDOM() LIMIT $1`,
    [n],
  );
  return result.rows.map((joke: any) => ({
    id: joke.joke_id,
    type: joke.type,
    setup: joke.setup,
    punchline: joke.punchline,
    rating: joke.rating,
    votes: joke.votes,
  }));
};

// Get 10 random jokes
export const randomTen = async (): Promise<Joke[]> => {
  return randomN(10);
};

// Get N random jokes
export const randomSelect = async (number: number): Promise<Joke[]> => {
  return randomN(number);
};

// Get jokes by type
export const jokeByType = async (type: string, n: number): Promise<Joke[]> => {
  const result = await pool.query(
    `SELECT * FROM jokes WHERE type = $1 ORDER BY RANDOM() LIMIT $2`,
    [type, n],
  );
  return result.rows.map((joke: any) => ({
    id: joke.joke_id,
    type: joke.type,
    setup: joke.setup,
    punchline: joke.punchline,
    rating: joke.rating,
    votes: joke.votes,
  }));
};

// Search jokes
export const searchJokes = async (query: string): Promise<Joke[]> => {
  const searchTerm = `%${query.toLowerCase()}%`;
  const result = await pool.query(
    `SELECT * FROM jokes
     WHERE LOWER(setup) LIKE $1
     OR LOWER(punchline) LIKE $1
     OR LOWER(type) LIKE $1`,
    [searchTerm],
  );

  return result.rows.map((joke: any) => ({
    id: joke.joke_id,
    type: joke.type,
    setup: joke.setup,
    punchline: joke.punchline,
    rating: joke.rating,
    votes: joke.votes,
  }));
};

// Get joke count
export const getCount = async (): Promise<number> => {
  const result = await pool.query("SELECT COUNT(*) as count FROM jokes");
  return parseInt(result.rows[0].count);
};

// Get joke by ID
export const jokeById = async (id: string): Promise<Joke | undefined> => {
  const result = await pool.query("SELECT * FROM jokes WHERE joke_id = $1", [
    id,
  ]);

  if (result.rows.length === 0) {
    return undefined;
  }

  const joke = result.rows[0];
  return {
    id: joke.joke_id,
    type: joke.type,
    setup: joke.setup,
    punchline: joke.punchline,
    rating: joke.rating,
    votes: joke.votes,
  };
};

// Add a new joke
export const addJoke = async (joke: Joke): Promise<Joke> => {
  const uuid = uuidv4();

  const result = await pool.query(
    `INSERT INTO jokes (joke_id, type, setup, punchline, rating, votes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [uuid, joke.type, joke.setup, joke.punchline, 0, 0],
  );

  const newJoke = result.rows[0];
  return {
    id: newJoke.joke_id,
    type: newJoke.type,
    setup: newJoke.setup,
    punchline: newJoke.punchline,
    rating: newJoke.rating,
    votes: newJoke.votes,
  };
};

// Update an existing joke
export const updateJoke = async (
  id: string,
  updatedJoke: Joke,
): Promise<Joke | undefined> => {
  // First check if joke exists
  const jokeExists = await jokeById(id);
  if (!jokeExists) {
    return undefined;
  }

  // Update joke
  const result = await pool.query(
    `UPDATE jokes
     SET type = $1, setup = $2, punchline = $3
     WHERE joke_id = $4
     RETURNING *`,
    [updatedJoke.type, updatedJoke.setup, updatedJoke.punchline, id],
  );

  const joke = result.rows[0];
  return {
    id: joke.joke_id,
    type: joke.type,
    setup: joke.setup,
    punchline: joke.punchline,
    rating: joke.rating,
    votes: joke.votes,
  };
};

// Rate a joke
export const rateJoke = async (
  id: string,
  rating: number,
): Promise<Joke | undefined> => {
  // First check if joke exists
  const jokeExists = await jokeById(id);
  if (!jokeExists) {
    return undefined;
  }

  // Get current rating and votes
  const currentJoke = await pool.query(
    "SELECT rating, votes FROM jokes WHERE joke_id = $1",
    [id],
  );

  const currentRating = parseFloat(currentJoke.rows[0].rating) || 0;
  const currentVotes = parseInt(currentJoke.rows[0].votes) || 0;

  // Calculate new weighted average rating
  const totalPoints = currentRating * currentVotes + rating;
  const newVotes = currentVotes + 1;
  const newRating = totalPoints / newVotes;

  // Update joke with new rating
  const result = await pool.query(
    `UPDATE jokes
     SET rating = $1, votes = $2
     WHERE joke_id = $3
     RETURNING *`,
    [newRating, newVotes, id],
  );

  const updatedJoke = result.rows[0];
  return {
    id: updatedJoke.joke_id,
    type: updatedJoke.type,
    setup: updatedJoke.setup,
    punchline: updatedJoke.punchline,
    rating: updatedJoke.rating,
    votes: updatedJoke.votes,
  };
};

// Load types into memory for quick access
export let types: string[] = [];
(async () => {
  try {
    types = await getTypes();
  } catch (err) {
    console.error("Error loading joke types:", err);
  }
})();

// Export count for backward compatibility
export let count = 0;
(async () => {
  try {
    count = await getCount();
  } catch (err) {
    console.error("Error loading joke count:", err);
  }
})();
