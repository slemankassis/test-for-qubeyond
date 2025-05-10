import * as fs from "fs";
import * as path from "path";

export interface Joke {
  id?: number;
  type: string;
  setup: string;
  punchline: string;
}

const jokesPath = path.join(__dirname, "../jokes/index.json");
const jokes: Joke[] = JSON.parse(fs.readFileSync(jokesPath, "utf8"));

let lastJokeId = 0;
jokes.forEach((joke) => {
  joke.id = ++lastJokeId;
});

export const types: string[] = Array.from(
  new Set(jokes.map((joke) => joke.type)),
);

export const randomJoke = (): Joke => {
  return jokes[Math.floor(Math.random() * jokes.length)];
};

/**
 * Get N random jokes from a jokeArray
 */
export const randomN = (jokeArray: Joke[], n: number): Joke[] => {
  const limit = Math.min(jokeArray.length, n);
  const randomIndicesSet = new Set<number>();

  while (randomIndicesSet.size < limit) {
    const randomIndex = Math.floor(Math.random() * jokeArray.length);
    if (!randomIndicesSet.has(randomIndex)) {
      randomIndicesSet.add(randomIndex);
    }
  }

  return Array.from(randomIndicesSet).map((randomIndex) => {
    return jokeArray[randomIndex];
  });
};

// Get 10 random jokes
export const randomTen = (): Joke[] => randomN(jokes, 10);

// Get N random jokes
export const randomSelect = (number: number): Joke[] => randomN(jokes, number);

// Get N jokes of a specific type
export const jokeByType = (type: string, n: number): Joke[] => {
  return randomN(
    jokes.filter((joke) => joke.type === type),
    n,
  );
};

// Get total joke count
export const count: number = jokes.length;

/**
 * Get a joke by its ID
 * @param {number} id - joke id
 * @returns a single joke object or undefined
 */
export const jokeById = (id: number): Joke | undefined => {
  return jokes.find((joke) => joke.id === id);
};

// Export the jokes array for testing
export { jokes };
