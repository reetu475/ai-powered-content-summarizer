import multer from 'multer';
import path from 'path';
import { isAllowedUpload } from '../utils/mediaTypes.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (isAllowedUpload(file)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Allowed: TXT, PDF, DOCX, DOC, audio (MP3, WAV, OGG, M4A, FLAC, WebM), and video (MP4, MOV, AVI, MKV, WebM).'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // Groq Whisper max 25MB
  }
});

export const uploadSingle = upload.single('file');

export default upload;
