import { Database } from 'sqlite';

export class BookDatabase {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // Method to select a book by book_id
  public async getBookById(bookId: string) {
    try {
      const existingBook = await this.db.get(
        `SELECT * FROM books WHERE book_id = ?`,
        bookId
      );
      return existingBook;
    } catch (error) {
      console.error(`Failed to retrieve book with ID: ${bookId}`, error);
      throw new Error('Database query error');
    }
  }

  // Method to insert a new book into the database
  public async insertBook(
    bookId: string,
    title: string,
    author: string,
    textContent: string
  ) {
    try {
      await this.db.run(
        `INSERT INTO books (book_id, title, author, text_content) VALUES (?, ?, ?, ?)`,
        bookId,
        title,
        author,
        textContent
      );
      console.info(`Book with ID: ${bookId} saved successfully`);
    } catch (error) {
      console.error(`Failed to insert book with ID: ${bookId}`, error);
      throw new Error('Database insert error');
    }
  }
}
