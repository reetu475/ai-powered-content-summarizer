import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';

let pinecone;
let index;

export const initializePinecone = async () => {
  try {
    if (!pinecone) {
      pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY || ''
      });
    }
    index = pinecone.Index(process.env.PINECONE_INDEX || 'ai-summarizer');
    console.log('Pinecone initialized successfully');
    return index;
  } catch (error) {
    console.error('Pinecone initialization error:', error);
    throw new Error('Failed to initialize Pinecone');
  }
};

export const storeSummary = async (summaryData) => {
  try {
    if (!index) {
      await initializePinecone();
    }

    const { id, userId, content, summaries, contentType, createdAt } = summaryData;
    
    // Create a combined text for embedding
    const combinedText = `${content} ${summaries.detailed} ${summaries.keywords.join(' ')}`;
    
    // Generate embedding (we'll use a simple hash for now, in production use OpenAI embeddings)
    const vector = await generateEmbedding(combinedText);

    const record = {
      id: id,
      values: vector,
      metadata: {
        userId,
        contentType,
        summaryType: 'all',
        createdAt,
        keywords: summaries.keywords.join(','),
        topics: summaries.topicAnalysis.substring(0, 500)
      }
    };

    await index.upsert({ records: [record] });
    return true;
  } catch (error) {
    console.error('Pinecone store error:', error);
    throw new Error('Failed to store summary in Pinecone');
  }
};

export const searchSimilarSummaries = async (userId, queryText, topK = 5) => {
  try {
    if (!index) {
      await initializePinecone();
    }

    const queryVector = await generateEmbedding(queryText);

    const results = await index.query({
      vector: queryVector,
      filter: {
        userId: { $eq: userId }
      },
      topK: topK,
      includeMetadata: true
    });

    return results.matches;
  } catch (error) {
    console.error('Pinecone search error:', error);
    throw new Error('Failed to search summaries');
  }
};

export const deleteSummary = async (summaryId) => {
  try {
    if (!index) {
      await initializePinecone();
    }

    await index.deleteOne({ id: summaryId });
    return true;
  } catch (error) {
    console.error('Pinecone delete error:', error);
    throw new Error('Failed to delete summary from Pinecone');
  }
};

// Simple embedding generator (in production, use OpenAI embeddings)
const generateEmbedding = async (text) => {
  // This is a placeholder. In production, use OpenAI's embedding API
  // For now, we'll create a simple hash-based vector
  const vector = new Array(1536).fill(0);
  const hash = simpleHash(text);
  
  for (let i = 0; i < vector.length; i++) {
    vector[i] = Math.sin(hash + i) * Math.cos(hash * i);
  }
  
  return vector;
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

export default pinecone;
