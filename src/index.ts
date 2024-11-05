import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database';
import { fetchAndSaveBook } from './controllers/bookController';
//import { BasicAuthAuthorizer } from './classes/BasicAuthAuthorizer';

//Timeout
const timeout = require("connect-timeout");


//Init express
const app = express();

// Enable CORS for all routes
app.use(cors());

//Use JSON for all routes
app.use(express.json());

// Set the default timeout (e.g., 30 seconds)
app.use(timeout("30s"));

//Used for basic auth for api-docs
const basicAuth = require('express-basic-auth');

const PORT = process.env.PORT || 3000;

(async () => {
    //Init the database
    const db = await initializeDatabase();
    //Main endpoint to retrieve a book
    //basicAuth({users: { 'Project': ' Gutenberg' }, challenge: true, unauthorizedResponse: new BasicAuthAuthorizer().getUnauthorizedResponse}),
    app.get('/book/:book_id', (req, res) => fetchAndSaveBook(db, req, res));

    //Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();
