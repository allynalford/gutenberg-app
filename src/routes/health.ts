import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    try {
        //respond
        res.status(200).send('ok')
    } catch (error: any) {
        console.error(error.message)
        res.status(error.status || 400).json({ error: error.message });
    }
});

export default router;
