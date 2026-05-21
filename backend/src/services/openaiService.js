import 'dotenv/config';
import Groq from 'groq-sdk';
import fs from 'fs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const transcribeAudio = async (filePath, originalFilename = '') => {
  try {
    const ext = originalFilename.includes('.')
      ? originalFilename.slice(originalFilename.lastIndexOf('.'))
      : '.mp3';
    const uploadName = `audio${ext}`;

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath, { filename: uploadName }),
      model: 'whisper-large-v3-turbo'
    });
    return transcription.text;
  } catch (error) {
    console.error('Groq Audio Transcription Error:', error.message);
    console.error('Full transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};

export const generateSummary = async (content, summaryType = 'detailed') => {
  try {
    let prompt = '';
    let systemPrompt = 'You are a professional content summarizer. Provide accurate, concise, and well-structured summaries.';

    switch (summaryType) {
      case 'short':
        prompt = `Provide a very short summary (1-2 sentences) of the following content:\n\n${content}`;
        break;
      case 'detailed':
        prompt = `Provide a comprehensive detailed summary of the following content:\n\n${content}`;
        break;
      case 'bulletPoints':
        prompt = `Provide a bullet-point summary of the following content. Each bullet point should be a key point:\n\n${content}`;
        break;
      case 'keywords':
        prompt = `Extract and list the most important keywords from the following content. Return as a comma-separated list:\n\n${content}`;
        break;
      case 'actionItems':
        prompt = `Extract all action items, tasks, or next steps from the following content. Return as a numbered list:\n\n${content}`;
        break;
      case 'topicAnalysis':
        prompt = `Analyze the main topics and themes in the following content. Provide a detailed topic analysis:\n\n${content}`;
        break;
      case 'strengthsWeaknesses':
        prompt = `Analyze the following content and provide a detailed analysis of its strengths and weaknesses. Format as:\n\nStrengths:\n- [strength 1]\n- [strength 2]\n\nWeaknesses:\n- [weakness 1]\n- [weakness 2]\n\nContent:\n\n${content}`;
        break;
      default:
        prompt = `Provide a comprehensive summary of the following content:\n\n${content}`;
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq API Error:', error.message);
    console.error('Full error:', error);
    if (error.status === 401) {
      throw new Error('Invalid Groq API key. Please check your API key configuration.');
    } else if (error.status === 429) {
      throw new Error('Groq API rate limit exceeded. Please try again later.');
    } else if (error.status === 500) {
      throw new Error('Groq API server error. Please try again later.');
    }
    throw new Error(`Failed to generate summary using AI: ${error.message}`);
  }
};

export const generateAllSummaries = async (content) => {
  try {
    console.log('Generating all summaries in a single JSON API request...');
    
    // Handle very large documents by truncating to stay safely within the 6,000 TPM limit
    // 16,000 characters is about 3,500 - 4,000 tokens, leaving enough headroom for the response!
    let processedContent = content;
    if (content.length > 16000) {
      console.log(`Content is very large (${content.length} characters). Compressing context to remain safely under Groq's 6,000 TPM limit...`);
      processedContent = content.slice(0, 13000) + "\n\n[... content truncated for length ...]\n\n" + content.slice(-3000);
    }

    const systemPrompt = `You are a professional content summarizer. You must analyze the provided content and return a JSON object containing different types of summaries.
The response must be a valid JSON object with the following exact keys and structure:
{
  "short": "A concise 1-2 sentence summary of the main point.",
  "detailed": "A comprehensive and well-structured detailed summary of the content.",
  "bulletPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "actionItems": ["Action item 1", "Action item 2"],
  "topicAnalysis": "An analysis of the main topics, themes, and subject matter discussed.",
  "strengthsWeaknesses": "An analysis of the strengths and weaknesses or pros and cons of the arguments/content."
}

Do not include any markdown formatting, backticks, or text before/after the JSON. Return only the JSON object.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please analyze and summarize the following content:\n\n${processedContent}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const jsonText = response.choices[0].message.content.trim();
    const summariesData = JSON.parse(jsonText);

    // Clean up lists (remove numbers, dashes, etc.) in case the LLM returned list items with prefixes
    const cleanList = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => {
        if (typeof item !== 'string') return String(item);
        // Strip out leading "- ", "* ", "1. ", "• "
        return item.replace(/^[\s•\-\*\d\.\)]+\s*/, '').trim();
      }).filter(item => item.length > 0);
    };

    return {
      short: summariesData.short || '',
      detailed: summariesData.detailed || '',
      bulletPoints: cleanList(summariesData.bulletPoints),
      keywords: cleanList(summariesData.keywords),
      actionItems: cleanList(summariesData.actionItems),
      topicAnalysis: summariesData.topicAnalysis || '',
      strengthsWeaknesses: summariesData.strengthsWeaknesses || ''
    };
  } catch (error) {
    console.error('Error in single-request summary generation:', error);
    throw new Error(`Failed to generate summaries: ${error.message}`);
  }
};

export const generateEmbedding = async (text) => {
  try {
    // Groq doesn't have embeddings API, so we'll use a simple hash-based approach
    // In production, you might want to use OpenAI embeddings or another embedding service
    const vector = new Array(1536).fill(0);
    const hash = simpleHash(text);
    
    for (let i = 0; i < vector.length; i++) {
      vector[i] = Math.sin(hash + i) * Math.cos(hash * i);
    }
    
    return vector;
  } catch (error) {
    console.error('Embedding Error:', error);
    throw new Error('Failed to generate embedding');
  }
};

const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default groq;
