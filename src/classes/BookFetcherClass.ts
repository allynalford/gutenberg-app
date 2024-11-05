import axios from 'axios';

class BookFetcher {
  async fetchBookData(bookId: number): Promise<{book_id: number, title: string; author: string; textContent: string }> {
    try {
      // URLs for content and metadata
      const contentUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;
      const metadataUrl = `https://www.gutenberg.org/ebooks/${bookId}`;

      // Fetch the book content
      const contentResponse = await axios.get(contentUrl);
      const textContent = contentResponse.data;

      // Fetch the book metadata
      const metadataResponse = await axios.get(metadataUrl);
      const metadata = metadataResponse.data;

      // Extract title and author from metadata
      const title = metadata.match(/<title>(.*?)<\/title>/)?.[1] || 'Unknown Title';
      const author = metadata.match(/<meta name="author" content="(.*?)">/)?.[1] || 'Unknown Author';

      return {book_id: bookId, title, author, textContent };
    } catch (error: any) {
      console.error(`Failed to fetch book data for book ID: ${bookId}`, error.message);
      throw new Error('Failed to fetch book data');
    }
  }
}

export default BookFetcher;
