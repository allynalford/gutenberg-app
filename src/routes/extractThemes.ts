import express from 'express';
import BookContentAnalyzer from '../classes/BookContentAnalyzer';

const router = express.Router();
const analyzer = new BookContentAnalyzer();

router.post('/', async (req, res) => {
  const { text } = req.body;
  try {
    const themes = await analyzer.extractThemes(text);
    res.json({ themes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to extract themes' });
  }
});

export default router;
