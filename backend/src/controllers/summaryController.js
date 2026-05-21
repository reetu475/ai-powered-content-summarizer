import Summary from '../models/Summary.js';
import { generateAllSummaries, generateEmbedding } from '../services/openaiService.js';
import { storeSummary, deleteSummary as deleteSummaryFromPinecone, searchSimilarSummaries } from '../services/pineconeService.js';
import { generateId } from '../utils/helpers.js';
import fs from 'fs';
import path from 'path';

// File-based summary storage for development persistence
const summariesFile = path.join(process.cwd(), 'summaries.json');
let summaries = new Map();

// Load summaries from file on startup
const loadSummaries = () => {
  try {
    if (fs.existsSync(summariesFile)) {
      const data = fs.readFileSync(summariesFile, 'utf8');
      const summariesArray = JSON.parse(data);
      summariesArray.forEach(summaryData => {
        const summary = new Summary(summaryData);
        summaries.set(summaryData.id, summary);
      });
      console.log(`Loaded ${summaries.size} summaries from file`);
    }
  } catch (error) {
    console.error('Error loading summaries:', error);
  }
};

// Save summaries to file
const saveSummaries = () => {
  try {
    const summariesArray = Array.from(summaries.values()).map(s => s.toJSON());
    fs.writeFileSync(summariesFile, JSON.stringify(summariesArray, null, 2));
  } catch (error) {
    console.error('Error saving summaries:', error);
  }
};

// Load summaries on startup
loadSummaries();

export const generateSummary = async (req, res) => {
  try {
    console.log('Generate summary request received:', req.body);
    const { content, contentType, originalContent } = req.body;
    const userId = 'guest'; // Use guest user ID since no authentication

    console.log('Generating summaries for content length:', content?.length);

    // Generate all summary types
    const summariesData = await generateAllSummaries(content);

    console.log('Summaries generated successfully');

    // Create summary object
    const summaryId = generateId();
    const summaryData = {
      id: summaryId,
      userId,
      content,
      contentType,
      originalContent: originalContent || content,
      summaries: summariesData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const summary = new Summary(summaryData);
    summaries.set(summaryId, summary);
    saveSummaries(); // Save to file

    // Store in Pinecone
    try {
      await storeSummary(summaryData);
    } catch (pineconeError) {
      console.error('Pinecone storage error (non-critical):', pineconeError);
    }

    console.log('Sending response');
    res.json({
      success: true,
      summary: summary.toJSON()
    });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate summary'
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    // Get all summaries (no authentication)
    const allSummaries = Array.from(summaries.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      summaries: allSummaries.map(s => s.toJSON()),
      total: allSummaries.length
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve summary history'
    });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const summary = summaries.get(id);
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }

    res.json({
      success: true,
      summary: summary.toJSON()
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve summary'
    });
  }
};

export const deleteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const summary = summaries.get(id);
    if (!summary) {
      return res.status(404).json({
        success: false,
        error: 'Summary not found'
      });
    }

    summaries.delete(id);
    saveSummaries(); // Save to file

    // Delete from Pinecone
    try {
      await deleteSummaryFromPinecone(id);
    } catch (pineconeError) {
      console.error('Pinecone delete error (non-critical):', pineconeError);
    }

    res.json({
      success: true,
      message: 'Summary deleted successfully'
    });
  } catch (error) {
    console.error('Delete summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete summary'
    });
  }
};

export const searchSummaries = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    // Search in Pinecone
    try {
      const results = await searchSimilarSummaries(userId, query, 5);
      
      const matchedSummaries = results
        .filter(match => summaries.has(match.id))
        .map(match => ({
          ...summaries.get(match.id).toJSON(),
          score: match.score
        }));

      res.json({
        success: true,
        summaries: matchedSummaries
      });
    } catch (pineconeError) {
      console.error('Pinecone search error, falling back to local search:', pineconeError);
      
      // Fallback to local text search
      const localResults = Array.from(summaries.values())
        .filter(s => s.userId === userId)
        .filter(s => 
          s.content.toLowerCase().includes(query.toLowerCase()) ||
          s.summaries.detailed.toLowerCase().includes(query.toLowerCase()) ||
          s.summaries.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
        )
        .map(s => s.toJSON());

      res.json({
        success: true,
        summaries: localResults
      });
    }
  } catch (error) {
    console.error('Search summaries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search summaries'
    });
  }
};

export default { generateSummary, getHistory, getSummary, deleteSummary, searchSummaries };
