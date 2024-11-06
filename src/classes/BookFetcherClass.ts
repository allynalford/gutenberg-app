import axios from 'axios';

class BookFetcher {

  extractAuthor(input: string): string | null {
    const match = input.match(/by\s(.+)/);
    return match ? match[1].trim() : null;
  }

  extractTitle(input: string): string | null {
    const match = input.match(/^(.+)\sby\s/);
    return match ? match[1].trim() : null;
  }
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
;
      // Extract title and author from metadata
      const titleAuthor =  metadata.match(/<meta name="title" content="(.*?)">/)?.[1];
      const title = this.extractTitle(titleAuthor) || 'Unknown Title';
      const author = this.extractAuthor(titleAuthor) || 'Unknown Author';

      return {book_id: bookId, title, author, textContent };
    } catch (error: any) {
      console.error(`Failed to fetch book metadata for book ID: ${bookId}`, error.message);
      throw new Error('Failed to fetch book metadata');
    }
  }
}

export default BookFetcher;
