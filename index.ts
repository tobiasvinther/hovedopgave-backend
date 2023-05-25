// Import the express in typescript file
import express from 'express';
import cors from "cors"
import path from 'path';
import { createDatabase } from './database/database';
import birdRouter from "./routers/birdRouter"
import uploadRouter from "./routers/uploadRouter";

 
// Initialize the express engine
const app: express.Application = express();
app.use(cors({ credentials: true, origin: true }))
 
// Take a port 8080 for running server.
const port: number = 8080;
 
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send({"message":"TypeScript With Express"});
});

createDatabase()

app.use(birdRouter)
app.use(uploadRouter)
// Serve the uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
});