import express from 'express';
import BookContentAnalyzer from '../classes/BookContentAnalyzer';

const router = express.Router();
const analyzer = new BookContentAnalyzer();

router.post('/', async (req, res) => {
  const { text } = req.body;
  try {
    const language = await analyzer.detectLanguage(text);
    res.json({ language });
  } catch (error) {
    res.status(500).json({ error: 'Failed to detect language' });
  }
});

export default router;
