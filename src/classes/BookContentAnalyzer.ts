import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
export default class BookContentAnalyzer {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.GROQ || "";
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  private async callGroqApi(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'llama3-8b-8192',
          messages: messages,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error calling Groq API:', error.response.statusText);
      throw new Error('Failed to call Groq API');
    }
  }

  public async identifyKeyCharacters(text: string): Promise<string> {
    const messages = [
      { role: 'system', content: 'Analyze the text to identify key characters.' },
      { role: 'user', content: text },
    ];
    return await this.callGroqApi(messages);
  }

  public async detectLanguage(text: string): Promise<string> {
    const messages = [
      { role: 'system', content: 'Detect the language of the provided text.' },
      { role: 'user', content: text },
    ];
    return await this.callGroqApi(messages);
  }

  public async analyzeSentiment(text: string): Promise<string> {
    const messages = [
      { role: 'system', content: 'Perform a sentiment analysis on the given text.' },
      { role: 'user', content: text },
    ];
    return await this.callGroqApi(messages);
  }

  public async summarizePlot(text: string): Promise<string> {
    const messages = [
      { role: 'system', content: 'Summarize the plot of the given text.' },
      { role: 'user', content: text },
    ];
    return await this.callGroqApi(messages);
  }

  public async extractThemes(text: string): Promise<string> {
    const messages = [
      { role: 'system', content: 'Identify key themes present in the text.' },
      { role: 'user', content: text },
    ];
    return await this.callGroqApi(messages);
  }
}
