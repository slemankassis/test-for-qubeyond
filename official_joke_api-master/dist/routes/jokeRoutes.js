"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("Try /random_joke, /random_ten, /jokes/random, /jokes/search?q=term, or /jokes/ten, /jokes/random/<any-number>");
});
router.get("/ping", (req, res) => {
    res.send("pong");
});
router.get("/random_joke", (req, res) => {
    res.json((0, db_1.randomJoke)());
});
router.get("/random_ten", (req, res) => {
    res.json((0, db_1.randomTen)());
});
router.get("/jokes/search", (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query) {
            return next({
                statusCode: 400,
                message: "Missing search query. Use ?q=searchterm",
            });
        }
        const results = (0, db_1.searchJokes)(query);
        return res.json(results);
    }
    catch (e) {
        return next(e);
    }
});
router.get("/jokes/random", (req, res) => {
    res.json((0, db_1.randomJoke)());
});
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
router.get("/jokes/ten", (req, res) => {
    res.json((0, db_1.randomTen)());
});
router.get("/jokes/:type/random", (req, res) => {
    res.json((0, db_1.jokeByType)(req.params.type, 1));
});
router.get("/jokes/:type/ten", (req, res) => {
    res.json((0, db_1.jokeByType)(req.params.type, 10));
});
router.post("/jokes/:id/rate", (req, res, next) => {
    try {
        const { id } = req.params;
        const { value } = req.body;
        if (value === undefined ||
            typeof value !== "number" ||
            value < 0 ||
            value > 5) {
            return next({
                statusCode: 400,
                message: "Invalid rating value. Must be a number between 0 and 5.",
            });
        }
        const joke = (0, db_1.rateJoke)(id, value);
        if (!joke) {
            return next({ statusCode: 404, message: "joke not found" });
        }
        return res.json(joke);
    }
    catch (e) {
        return next(e);
    }
});
router.get("/jokes/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        const joke = (0, db_1.jokeById)(id);
        if (!joke)
            return next({ statusCode: 404, message: "joke not found" });
        return res.json(joke);
    }
    catch (e) {
        return next(e);
    }
});
router.post("/jokes", (req, res, next) => {
    try {
        const { type, setup, punchline } = req.body;
        if (!type || !setup || !punchline) {
            return next({
                statusCode: 400,
                message: "Missing required fields: type, setup, punchline",
            });
        }
        const newJoke = { type, setup, punchline };
        const addedJoke = (0, db_1.addJoke)(newJoke);
        return res.status(201).json(addedJoke);
    }
    catch (e) {
        return next(e);
    }
});
router.put("/jokes/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        const { type, setup, punchline } = req.body;
        if (!type || !setup || !punchline) {
            return next({
                statusCode: 400,
                message: "Missing required fields: type, setup, punchline",
            });
        }
        const jokeUpdate = { type, setup, punchline };
        const updatedJoke = (0, db_1.updateJoke)(id, jokeUpdate);
        if (!updatedJoke) {
            return next({ statusCode: 404, message: "joke not found" });
        }
        return res.json(updatedJoke);
    }
    catch (e) {
        return next(e);
    }
});
router.get("/types", (req, res) => {
    res.json(db_1.types);
});
exports.default = router;
