import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export interface Joke {
  id?: string;
  type: string;
  setup: string;
  punchline: string;
  rating?: number;
  votes?: number;
}

const jokesPath = path.join(__dirname, "../jokes/index.json");
const jokes: Joke[] = JSON.parse(fs.readFileSync(jokesPath, "utf8"));

jokes.forEach((joke) => {
  if (!joke.id) {
    joke.id = uuidv4();
  }
});

export const types: string[] = Array.from(
  new Set(jokes.map((joke) => joke.type)),
);

export const randomJoke = (): Joke => {
  return jokes[Math.floor(Math.random() * jokes.length)];
};

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

export const randomTen = (): Joke[] => randomN(jokes, 10);

export const randomSelect = (number: number): Joke[] => randomN(jokes, number);

export const jokeByType = (type: string, n: number): Joke[] => {
  return randomN(
    jokes.filter((joke) => joke.type === type),
    n,
  );
};

export const count: number = jokes.length;

export const jokeById = (id: string): Joke | undefined => {
  return jokes.find((joke) => joke.id === id);
};

export const addJoke = (joke: Joke): Joke => {
  const newJoke: Joke = {
    ...joke,
    id: uuidv4(),
    rating: 0,
    votes: 0,
  };

  jokes.push(newJoke);

  saveJokesToFile();

  return newJoke;
};

export const updateJoke = (id: string, updatedJoke: Joke): Joke | undefined => {
  const index = jokes.findIndex((joke) => joke.id === id);

  if (index === -1) {
    return undefined;
  }

  jokes[index] = {
    ...updatedJoke,
    id: jokes[index].id,
    rating: jokes[index].rating,
    votes: jokes[index].votes,
  };

  saveJokesToFile();

  return jokes[index];
};

const saveJokesToFile = (): void => {
  fs.writeFileSync(jokesPath, JSON.stringify(jokes, null, 2), "utf8");
};

export { jokes };
