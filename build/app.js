"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
// Create a new express application instance
const app = express_1.default();
// Call midlewares
app.use(cors_1.default());
app.use(helmet_1.default());
app.use(body_parser_1.default.json());
//Set all routes from routes folder
const index = require("./routes/");
app.use("/", index);
typeorm_1.createConnection();
app.listen(3000, function () {
    console.log("Server started on port 3000!");
});
