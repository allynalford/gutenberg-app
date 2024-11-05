import express from 'express';
import BookContentAnalyzer from '../classes/BookContentAnalyzer';

const router = express.Router();
const analyzer = new BookContentAnalyzer();

router.post('/', async (req, res) => {
  const { text } = req.body;
  try {
    const characters = await analyzer.identifyKeyCharacters(text);
    res.json({ characters });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze characters' });
  }
});

export default router;
