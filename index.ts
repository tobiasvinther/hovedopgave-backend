// Import the express in typescript file
import express from 'express';
import cors from "cors"
import { createDatabase } from './database/database';
import birdRouter from "./routers/birdRouter"
import userRouter from "./routers/userRouter"
import uploadRouter from "./routers/uploadRouter";
import session, { SessionOptions } from "express-session";
const bp = require('body-parser')

 
// Initialize the express engine
const app: express.Application = express();
app.use(cors({ credentials: true, origin: true }))

// Middleware to use session to forfill the stateless situation between server and clint
const sessionConfig: SessionOptions = {
    secret: 'keyboard cat',
    name: 'Test',
    resave: false,
    saveUninitialized: true,
    cookie: {
    }
  };
  app.use(session(sessionConfig));
// Middleware to use bodyparser
app.use(express.json());  
app.use(bp.urlencoded({ extended: true }))

// Take a port 8080 for running server.
const port: number = 8080;
 
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send({"message":"TypeScript With Express"});
});

createDatabase()

app.use(birdRouter)
app.use(userRouter)
app.use(uploadRouter)


 
// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
});