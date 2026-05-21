import path from 'path';

const AUDIO_EXTENSIONS = new Set([
  '.mp3', '.wav', '.ogg', '.m4a', '.flac', '.webm', '.mpeg', '.mpga', '.opus'
]);

const VIDEO_EXTENSIONS = new Set([
  '.mp4', '.mpeg', '.mpg', '.mov', '.webm', '.avi', '.mkv', '.wmv', '.m4v'
]);

const DOCUMENT_EXTENSIONS = new Set(['.txt', '.pdf', '.docx', '.doc']);

const ALLOWED_MIME_TYPES = new Set([
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/m4a',
  'audio/webm',
  'audio/flac',
  'audio/opus',
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
  'video/x-matroska',
  'video/avi',
  'application/octet-stream'
]);

export const getFileExtension = (filename) =>
  path.extname(filename || '').toLowerCase();

export const isAllowedUpload = (file) => {
  const ext = getFileExtension(file.originalname);
  if (DOCUMENT_EXTENSIONS.has(ext) || AUDIO_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext)) {
    return true;
  }
  return ALLOWED_MIME_TYPES.has(file.mimetype);
};

export const getMediaCategory = (mimetype, filename) => {
  const ext = getFileExtension(filename);

  if (mimetype?.startsWith('audio/') || AUDIO_EXTENSIONS.has(ext)) {
    return 'audio';
  }
  if (mimetype?.startsWith('video/') || VIDEO_EXTENSIONS.has(ext)) {
    return 'video';
  }
  if (DOCUMENT_EXTENSIONS.has(ext)) {
    return 'document';
  }
  if (mimetype === 'text/plain' || ext === '.txt') return 'document';
  if (mimetype === 'application/pdf' || ext === '.pdf') return 'document';
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === '.docx'
  ) {
    return 'document';
  }
  if (mimetype === 'application/msword' || ext === '.doc') {
    return 'document';
  }
  return null;
};

export { AUDIO_EXTENSIONS, VIDEO_EXTENSIONS, DOCUMENT_EXTENSIONS };
