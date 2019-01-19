"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
exports.checkJwt = (req, res, next) => {
    //Get the jwt token from the head
    const token = req.headers["auth"];
    let jwtPayload;
    //Try to validate the token and get data
    try {
        jwtPayload = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        //If fails, respond with 401 unauthorized
        res.status(401).send();
        return;
    }
    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jsonwebtoken_1.default.sign({ userId, username }, config_1.default.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);
    //Call the next middleware or controller
    next();
};
