"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
console.log("===== Joke API Test =====");
// Log joke count
console.log(`Total jokes: ${db_1.jokes.length}`);
// Get a random joke
console.log("\nRandom joke:");
console.log((0, db_1.randomJoke)());
// Get random ten jokes
console.log("\nRandom ten (first 3 shown):");
const tenJokes = (0, db_1.randomTen)();
console.log(tenJokes.slice(0, 3));
// Get jokes by type
console.log("\nProgramming jokes (first 3 shown):");
const programmingJokes = (0, db_1.jokeByType)("programming", 5);
console.log(programmingJokes.slice(0, 3));
console.log("\nAPI TypeScript conversion completed successfully!");
