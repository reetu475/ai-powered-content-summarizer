import express from 'express';
import { generateSummary, getHistory, getSummary, deleteSummary, searchSummaries } from '../controllers/summaryController.js';

const router = express.Router();

router.post('/generate', generateSummary);
router.get('/history', getHistory);
router.get('/search', searchSummaries);
router.get('/:id', getSummary);
router.delete('/:id', deleteSummary);

export default router;
