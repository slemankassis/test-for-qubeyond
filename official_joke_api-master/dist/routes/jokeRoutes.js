"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
// Root endpoint - instructions
router.get("/", (req, res) => {
    res.send("Try /random_joke, /random_ten, /jokes/random, or /jokes/ten , /jokes/random/<any-number>");
});
// Health check endpoint
router.get("/ping", (req, res) => {
    res.send("pong");
});
// Get a random joke
router.get("/random_joke", (req, res) => {
    res.json((0, db_1.randomJoke)());
});
// Get 10 random jokes
router.get("/random_ten", (req, res) => {
    res.json((0, db_1.randomTen)());
});
// Alternate endpoint for random joke
router.get("/jokes/random", (req, res) => {
    res.json((0, db_1.randomJoke)());
});
// Get N random jokes
router.get("/jokes/random/:num", (req, res, next) => {
    let num;
    try {
        num = parseInt(req.params.num);
        if (!num) {
            res.send("The passed path is not a number.");
        }
        else {
            if (num > db_1.count) {
                res.send(`The passed path exceeds the number of jokes (${db_1.count}).`);
            }
            else {
                res.json((0, db_1.randomSelect)(num));
            }
        }
    }
    catch (e) {
        return next(e);
    }
});
// Alternate endpoint for 10 random jokes
router.get("/jokes/ten", (req, res) => {
    res.json((0, db_1.randomTen)());
});
// Get a random joke of a specific type
router.get("/jokes/:type/random", (req, res) => {
    res.json((0, db_1.jokeByType)(req.params.type, 1));
});
// Get 10 jokes of a specific type
router.get("/jokes/:type/ten", (req, res) => {
    res.json((0, db_1.jokeByType)(req.params.type, 10));
});
// Get a joke by ID
router.get("/jokes/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        const joke = (0, db_1.jokeById)(+id);
        if (!joke)
            return next({ statusCode: 404, message: "joke not found" });
        return res.json(joke);
    }
    catch (e) {
        return next(e);
    }
});
// Get all available joke types
router.get("/types", (req, res) => {
    res.json(db_1.types);
});
exports.default = router;
