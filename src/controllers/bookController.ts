import axios from 'axios';
import { Request, Response } from 'express';
import { Database } from 'sqlite';
import { BookDatabase } from '../classes/BookDataClass';
export const fetchAndSaveBook = async (db: Database, req: Request, res: Response) => {
  const { book_id } = req.params;

  try {
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

    //Content URL
    const contentUrl = `https://www.gutenberg.org/files/${book_id}/${book_id}-0.txt`;
    //Metadata URL
    const metadataUrl = `https://www.gutenberg.org/ebooks/${book_id}`;

    // Fetch the book
    const contentResponse = await axios.get(contentUrl);
    //Grab the data
    const textContent = contentResponse.data;

    // Fetch book metadata (title and author parsing can be expanded)
    const metadataResponse = await axios.get(metadataUrl);
    //Grab the data
    const metadata = metadataResponse.data;
    //Get the title from the data
    const title = metadata.match(/<title>(.*?)<\/title>/)?.[1] || 'Unknown Title';
    //Grab the author
    const author = metadata.match(/<meta name="author" content="(.*?)">/)?.[1] || 'Unknown Author';

    // Insert into SQLite database
    await bookDatabaseInstance.insertBook(book_id, title, author, textContent);

    //Log what happened
    console.info(`Book with ID: ${book_id} saved successfully`)

    // Return the newly fetched and saved book data
    res.status(201).json({
      book_id,
      title,
      author,
      textContent
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(error.status).json({status: error.status,statusText: error.response.statusText, error: `Failed to fetch or save ${book_id} book data` });
  }
};
