// Import the express in typescript file
import express from "express";
import cors from "cors";
import path from "path";
import { createDatabase } from "./database/database";
import birdRouter from "./routers/birdRouter";
import userRouter from "./routers/userRouter";
import uploadRouter from "./routers/uploadRouter";
import observationRouter from "./routers/observationRouter";

import sessiontp, { SessionOptions } from "express-session";
const bp = require("body-parser");

// Her er du tilbage til start før slettet
// Initialize the express engine
const app: express.Application = express();
app.use(cors({ credentials: true, origin: true }));

declare module "express-session" {
  interface SessionData {
    loggedIn: boolean;

    // Add more custom properties if needed
  }
}
// Setup session options
const sessionConfig: SessionOptions = {
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
};
// Middleware to use session to forfill the stateless situation between server and clint
app.use(sessiontp(sessionConfig));

// Middleware to use bodyparser
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));

// Take a port 8080 for running server.
const port: number = 8080;

// Handling '/' Request
app.get("/", (_req, _res) => {
  _res.send({ message: "TypeScript With Express" });
});

createDatabase();

app.use(birdRouter);
app.use(userRouter);
app.use(uploadRouter);
app.use(observationRouter);

// Serve the uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Server setup
app.listen(port, () => {
  console.log(`TypeScript with Express
         http://localhost:${port}/`);
});
