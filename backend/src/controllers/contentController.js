import scrapeUrl from '../services/scraperService.js';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { transcribeAudio } from '../services/openaiService.js';
import { getMediaCategory } from '../utils/mediaTypes.js';
import {
  prepareMediaForTranscription,
  safeUnlink
} from '../services/mediaExtractionService.js';

export const processText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text content is required'
      });
    }

    res.json({
      success: true,
      content: text.trim(),
      contentType: 'text'
    });
  } catch (error) {
    console.error('Process text error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process text'
    });
  }
};

export const processUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    const scrapedData = await scrapeUrl(url);

    res.json({
      success: true,
      content: scrapedData.content,
      contentType: 'url',
      metadata: {
        title: scrapedData.title,
        url: scrapedData.url
      }
    });
  } catch (error) {
    console.error('Process URL error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process URL'
    });
  }
};

export const processFile = async (req, res) => {
  let filePath = null;
  const cleanupPaths = [];

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const mediaCategory = getMediaCategory(req.file.mimetype, req.file.originalname);

    if (mediaCategory === 'audio') {
      const content = await transcribeAudio(filePath, req.file.originalname);
      return res.json({
        success: true,
        content: content.trim(),
        contentType: 'audio',
        originalContent: req.file.originalname
      });
    }

    if (mediaCategory === 'video') {
      const { transcribePath, cleanupPaths: tempPaths } =
        await prepareMediaForTranscription(filePath, 'video');
      cleanupPaths.push(...tempPaths);

      const content = await transcribeAudio(transcribePath, req.file.originalname);
      return res.json({
        success: true,
        content: content.trim(),
        contentType: 'video',
        originalContent: req.file.originalname
      });
    }

    if (mediaCategory !== 'document') {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type'
      });
    }

    let content = '';

    switch (fileExtension) {
      case '.txt':
        content = fs.readFileSync(filePath, 'utf8');
        break;
      case '.pdf': {
        const pdfData = await pdf(filePath);
        content = pdfData.text;
        break;
      }
      case '.docx': {
        const docxData = await mammoth.extractRawText({ path: filePath });
        content = docxData.value;
        break;
      }
      case '.doc':
        content = 'DOC file parsing not fully supported. Please convert to DOCX or TXT.';
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported file type'
        });
    }

    res.json({
      success: true,
      content: content.trim(),
      contentType: 'file',
      originalContent: req.file.originalname
    });
  } catch (error) {
    console.error('Process file error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process file'
    });
  } finally {
    cleanupPaths.forEach(safeUnlink);
    safeUnlink(filePath);
  }
};

export default { processText, processUrl, processFile };
