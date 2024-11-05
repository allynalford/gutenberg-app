import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database';
import { fetchAndSaveBook } from './controllers/bookController';
//import { BasicAuthAuthorizer } from './classes/BasicAuthAuthorizer';
import { RootPathHandler } from './classes/util/RootPathHandler';
import { EnvChecker } from './classes/util/EnvChecker';
//Routes
import analyzeCharactersRouter from './routes/analyzeCharacters';
import detectLanguageRouter from './routes/detectLanguage';
import analyzeSentimentRouter from './routes/analyzeSentiment';
import summarizePlotRouter from './routes/summarizePlot';
import extractThemesRouter from './routes/extractThemes';

//.env
dotenv.config();

//Handle root path calls
const rootPathHandler = new RootPathHandler();
//Init Env Checker
const envChecker = new EnvChecker();

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

//Basic Auth
//const basicAuth = require('express-basic-auth');

const PORT = process.env.PORT || 3000;

// Middleware to remove X-Powered-By header from all responses
app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.removeHeader('x-powered-by');
    next();
});


// Apply the class method for the root path ('/'), throw a 403
app.get('/', (req, res, next) => rootPathHandler.handleRequest(req, res, next));
app.post('/', (req, res, next) => rootPathHandler.handleRequest(req, res, next));
app.delete('/', (req, res, next) => rootPathHandler.handleRequest(req, res, next));
app.patch('/', (req, res, next) => rootPathHandler.handleRequest(req, res, next));

//Setup Routes for LLM
app.use('/analyze-characters', analyzeCharactersRouter);
app.use('/detect-language', detectLanguageRouter);
app.use('/analyze-sentiment', analyzeSentimentRouter);
app.use('/summarize-plot', summarizePlotRouter);
app.use('/extract-themes', extractThemesRouter);

//Init main route, start the server
(async () => {
    //Init the database
    const db = await initializeDatabase();

    //Cache the DB instance to be used by routes
    app.set('db', db);  
    
    //TODO: setup basic auth
    //basicAuth({users: { 'Project': ' Gutenberg' }, challenge: true, unauthorizedResponse: new BasicAuthAuthorizer().getUnauthorizedResponse}),
    
    //Init the main route with database access to retrieve a book
    app.get('/book/:book_id', (req, res) => fetchAndSaveBook(db, req, res));

    //Start the server
    app.listen(PORT, () => {
        try {
            //Check to make sure all required .env variables are set
            envChecker.checkEnvVariables()
            console.info(`Server is listening on port ${PORT}!`)
        } catch (error: any) {
            console.error('Stopping the server from starting due to:', error.message);
            process.exit(1); // Stop the server from starting
        }
    });
})();
