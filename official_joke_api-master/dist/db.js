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
exports.jokes = exports.updateJoke = exports.addJoke = exports.jokeById = exports.count = exports.jokeByType = exports.randomSelect = exports.randomTen = exports.randomN = exports.randomJoke = exports.types = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const jokesPath = path.join(__dirname, "../jokes/index.json");
const jokes = JSON.parse(fs.readFileSync(jokesPath, "utf8"));
exports.jokes = jokes;
jokes.forEach((joke) => {
    if (!joke.id) {
        joke.id = (0, uuid_1.v4)();
    }
});
exports.types = Array.from(new Set(jokes.map((joke) => joke.type)));
const randomJoke = () => {
    return jokes[Math.floor(Math.random() * jokes.length)];
};
exports.randomJoke = randomJoke;
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
const randomTen = () => (0, exports.randomN)(jokes, 10);
exports.randomTen = randomTen;
const randomSelect = (number) => (0, exports.randomN)(jokes, number);
exports.randomSelect = randomSelect;
const jokeByType = (type, n) => {
    return (0, exports.randomN)(jokes.filter((joke) => joke.type === type), n);
};
exports.jokeByType = jokeByType;
exports.count = jokes.length;
const jokeById = (id) => {
    return jokes.find((joke) => joke.id === id);
};
exports.jokeById = jokeById;
const addJoke = (joke) => {
    const newJoke = {
        ...joke,
        id: (0, uuid_1.v4)(),
        rating: 0,
        votes: 0,
    };
    jokes.push(newJoke);
    saveJokesToFile();
    return newJoke;
};
exports.addJoke = addJoke;
const updateJoke = (id, updatedJoke) => {
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
exports.updateJoke = updateJoke;
const saveJokesToFile = () => {
    fs.writeFileSync(jokesPath, JSON.stringify(jokes, null, 2), "utf8");
};
