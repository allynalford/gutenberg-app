import axios from 'axios';
import { Request, Response } from 'express';
import { Database } from 'sqlite';

export const fetchAndSaveBook = async (db: Database, req: Request, res: Response) => {
  const { book_id } = req.params;

  try {
    // Check if book already exists in the database
    const existingBook = await db.get(
      `SELECT * FROM books WHERE book_id = ?`,
      book_id
    );

    if (existingBook) {
      // If found, return the existing book data
      console.info(`Book with ID: ${book_id} retrieved from database`)
      res.status(200).json({
        book_id: existingBook.book_id,
        title: existingBook.title,
        author: existingBook.author,
        textContent: existingBook.text_content
      });
      return;
    }

    //Content
    const contentUrl = `https://www.gutenberg.org/files/${book_id}/${book_id}-0.txt`;
    //Metadata
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
    await db.run(
      `INSERT INTO books (book_id, title, author, text_content) VALUES (?, ?, ?, ?)`,
      book_id, title, author, textContent
    );

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
