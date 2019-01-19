// lib/app.ts
import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import {createConnection} from "typeorm";

// Create a new express application instance
const app: express.Application = express();

// Call midlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

//Set all routes from routes folder
const index = require("./routes/");
app.use("/", index);

createConnection()

app.listen(3000, function() {
  console.log("Server started on port 3000!");
});
