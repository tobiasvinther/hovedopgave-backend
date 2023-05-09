// Import the express in typescript file
import express from 'express';
import cors from "cors"

 
// Initialize the express engine
const app: express.Application = express();
app.use(cors({ credentials: true, origin: true }))
 
// Take a port 8080 for running server.
const port: number = 8080;
 
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send({"message":"TypeScript With Express"});
});
 
// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
});