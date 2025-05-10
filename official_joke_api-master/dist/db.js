"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.jokes = exports.jokeById = exports.count = exports.jokeByType = exports.randomSelect = exports.randomTen = exports.randomN = exports.randomJoke = exports.types = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Load jokes from JSON file
const jokesPath = path.join(__dirname, "../jokes/index.json");
const jokes = JSON.parse(fs.readFileSync(jokesPath, "utf8"));
exports.jokes = jokes;
// Add IDs to jokes
let lastJokeId = 0;
jokes.forEach((joke) => {
    joke.id = ++lastJokeId;
});
// Get all available joke types
exports.types = Array.from(new Set(jokes.map((joke) => joke.type)));
// Get a random joke
const randomJoke = () => {
    return jokes[Math.floor(Math.random() * jokes.length)];
};
exports.randomJoke = randomJoke;
/**
 * Get N random jokes from a jokeArray
 */
const randomN = (jokeArray, n) => {
    const limit = Math.min(jokeArray.length, n);
    const randomIndicesSet = new Set();
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
exports.randomN = randomN;
// Get 10 random jokes
const randomTen = () => (0, exports.randomN)(jokes, 10);
exports.randomTen = randomTen;
// Get N random jokes
const randomSelect = (number) => (0, exports.randomN)(jokes, number);
exports.randomSelect = randomSelect;
// Get N jokes of a specific type
const jokeByType = (type, n) => {
    return (0, exports.randomN)(jokes.filter((joke) => joke.type === type), n);
};
exports.jokeByType = jokeByType;
// Get total joke count
exports.count = jokes.length;
/**
 * Get a joke by its ID
 * @param {number} id - joke id
 * @returns a single joke object or undefined
 */
const jokeById = (id) => {
    return jokes.find((joke) => joke.id === id);
};
exports.jokeById = jokeById;
