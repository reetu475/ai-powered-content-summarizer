import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeUrl = async (url) => {
  try {
    // Validate URL
    if (!url || !url.startsWith('http')) {
      throw new Error('Invalid URL format');
    }

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script, style, nav, footer, header, aside').remove();

    // Extract text content
    const text = $('body').text().replace(/\s+/g, ' ').trim();

    if (text.length < 50) {
      throw new Error('Could not extract meaningful content from URL');
    }

    return {
      content: text,
      title: $('title').text() || 'Untitled',
      url: url
    };
  } catch (error) {
    console.error('URL scraping error:', error);
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
};

export default scrapeUrl;
