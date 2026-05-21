import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { getFileExtension } from '../utils/mediaTypes.js';

const execFileAsync = promisify(execFile);

let ffmpegPath = null;

const resolveFfmpegPath = async () => {
  if (ffmpegPath) return ffmpegPath;

  try {
    const ffmpegStatic = await import('ffmpeg-static');
    if (ffmpegStatic.default) {
      ffmpegPath = ffmpegStatic.default;
      return ffmpegPath;
    }
  } catch {
    // ffmpeg-static not installed; fall back to system ffmpeg
  }

  ffmpegPath = 'ffmpeg';
  return ffmpegPath;
};

const GROQ_TRANSCRIBE_EXTENSIONS = new Set([
  '.flac', '.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.ogg', '.wav', '.webm'
]);

export const canTranscribeDirectly = (filePath) =>
  GROQ_TRANSCRIBE_EXTENSIONS.has(getFileExtension(filePath));

/**
 * Extract mono 16kHz MP3 audio from a video file for Whisper transcription.
 */
export const extractAudioFromVideo = async (videoPath) => {
  const outputPath = `${videoPath}-audio.mp3`;

  const ffmpeg = await resolveFfmpegPath();
  await execFileAsync(ffmpeg, [
    '-i', videoPath,
    '-vn',
    '-acodec', 'libmp3lame',
    '-ar', '16000',
    '-ac', '1',
    '-y',
    outputPath
  ]);

  return outputPath;
};

/**
 * Resolve the file path Groq should transcribe (always extract audio track from video).
 */
export const prepareMediaForTranscription = async (filePath, category) => {
  if (category !== 'video') {
    return { transcribePath: filePath, cleanupPaths: [] };
  }

  try {
    const extractedPath = await extractAudioFromVideo(filePath);
    return { transcribePath: extractedPath, cleanupPaths: [extractedPath] };
  } catch (extractError) {
    if (canTranscribeDirectly(filePath)) {
      console.warn('ffmpeg extraction failed, sending video file directly to Groq:', extractError.message);
      return { transcribePath: filePath, cleanupPaths: [] };
    }
    throw new Error(
      'Could not extract audio from video. Install ffmpeg or use MP4/WebM format.'
    );
  }
};

export const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Failed to delete temp file:', filePath, err.message);
    }
  }
};

export default { prepareMediaForTranscription, extractAudioFromVideo, canTranscribeDirectly };
