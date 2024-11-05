import express, { Request, Response } from 'express';
import BookContentAnalyzer from '../classes/BookContentAnalyzer';
import { Database } from 'sqlite';
import BookDatabase from '../classes/BookDataClass';
const router = express.Router();
const analyzer = new BookContentAnalyzer();

router.get('/:book_id', async (req: Request, res: Response) => {
  const { book_id } = req.params;
  try {
    // Instantiate the Database
    const db: Database = req.app.get('db');
    //Instantiate the book class
    const bookDatabaseInstance = new BookDatabase(db);
    //grab the book from the database
    const book = await bookDatabaseInstance.getBookById(book_id);
    //If we don't have the book yet
    if (!book) {
      res.json({ error: `Failed to detect language. Book doesn't exists within database` });
    }    
    //analyze the book
    const language = await analyzer.detectLanguage(book.text_content.slice(1, 1500));
    res.json({ language });
  } catch (error: any) {
    console.error(error.message)
    res.status(error.status || 400).json({ error: 'Failed to detect language' });
  }
});

export default router;
