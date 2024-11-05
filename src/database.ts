import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initializeDatabase = async () => {
  const db = await open({
    filename: './data/gutenberg.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY,
      book_id INTEGER NOT NULL,
      title TEXT,
      author TEXT,
      text_content TEXT
    )
  `);

  return db;
};
