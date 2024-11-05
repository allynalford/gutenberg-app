import express, { Request, Response } from 'express';
import { Database } from 'sqlite';
import axios from 'axios';
import { BookDatabase } from '../classes/BookDataClass';
import BookFetcher from '../classes/BookFetcherClass';

const router = express.Router();

//TODO: setup basic auth
//basicAuth({users: { 'Project': ' Gutenberg' }, challenge: true, unauthorizedResponse: new BasicAuthAuthorizer().getUnauthorizedResponse}),

router.get('/:book_id', async (req: Request, res: Response) => {
    const { book_id } = req.params;

    try {
        // Instantiate the Database
        const db: Database = req.app.get('db');
        //Instantiate the book class
        const bookDatabaseInstance = new BookDatabase(db);
        // Check if book already exists in the database
        const existingBook = await bookDatabaseInstance.getBookById(book_id);

        // If found, return the existing book data
        if (existingBook) {
            //Log what happened
            console.info(`Book with ID: ${book_id} retrieved from database`);

            // Return the saved book data
            res.status(200).json({
                book_id: existingBook.book_id,
                title: existingBook.title,
                author: existingBook.author,
                textContent: existingBook.text_content
            });
            return;
        }
        //Init the book class, since we don't have the book
        const bookFetcherInstance = new BookFetcher();

        //Grab the book
        const book = await bookFetcherInstance.fetchBookData(Number(book_id));

        // Insert the book into SQLite database
        await bookDatabaseInstance.insertBook(book.book_id, book.title, book.author, book.textContent);

        // Return the newly fetched and saved book data
        res.status(201).json({
            book_id,
            title: book.title,
            author: book.author,
            textContent: book.textContent
        });
    } catch (error: any) {
        console.error(error.message);
        res.status(error.status).json({ status: error.status, statusText: error.response.statusText, error: `Failed to fetch or save ${book_id} book data` });
    }
});

export default router;
