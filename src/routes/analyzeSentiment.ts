import express from 'express';
import BookContentAnalyzer from '../classes/BookContentAnalyzer';

const router = express.Router();
const analyzer = new BookContentAnalyzer();

router.post('/', async (req, res) => {
  const { text } = req.body;
  try {
    const sentiment = await analyzer.analyzeSentiment(text);
    res.json({ sentiment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

export default router;
