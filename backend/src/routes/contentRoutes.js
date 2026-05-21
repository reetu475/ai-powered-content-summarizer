import express from 'express';
import { processText, processUrl, processFile } from '../controllers/contentController.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';
import { urlValidation, validateRequest } from '../utils/validators.js';

const router = express.Router();

const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    }
    next();
  });
};

router.post('/text', processText);
router.post('/url', urlValidation, validateRequest, processUrl);
router.post('/file', handleUpload, processFile);

export default router;
