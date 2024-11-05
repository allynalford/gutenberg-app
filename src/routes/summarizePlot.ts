import express from 'express';
import BookContentAnalyzer from '../classes/BookContentAnalyzer';

const router = express.Router();
const analyzer = new BookContentAnalyzer();

router.post('/', async (req, res) => {
  const { text } = req.body;
  try {
    const plotSummary = await analyzer.summarizePlot(text);
    res.json({ plotSummary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to summarize plot' });
  }
});

export default router;
