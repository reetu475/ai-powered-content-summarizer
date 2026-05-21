import { useState } from 'react';
import { summaryAPI, contentAPI } from '../services/api';
import SummaryInput from '../components/summary/SummaryInput';
import SummaryResult from '../components/summary/SummaryResult';
import Card from '../components/common/Button';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleContentSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      console.log('Submitting content:', data);
      let processedContent = data.content;

      // If file/audio/video is uploaded via FormData, upload and process it first
      if (data.fileData || data.file) {
        console.log('Uploading and processing file/audio/video...');
        const response = await contentAPI.processFile(data.fileData || data.file);
        processedContent = response.data.content;
        data.contentType = response.data.contentType || data.contentType;
        console.log('Processed content from file/audio/video:', processedContent);
      } else if (data.contentType === 'url') {
        // If URL, scrape it first
        console.log('Processing URL:', data.content);
        const response = await contentAPI.processUrl({ url: data.content });
        processedContent = response.data.content;
        console.log('Processed content from URL:', processedContent);
      }

      // Generate summary
      console.log('Generating summary for:', { content: processedContent, contentType: data.contentType });
      const response = await summaryAPI.generate({
        content: processedContent,
        contentType: data.contentType,
        originalContent: data.originalContent || data.content
      });
      console.log('Summary response:', response.data);

      setSummary(response.data.summary);
    } catch (err) {
      console.error('Error generating summary:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.error || err.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">AI-Powered Content Summarizer</h1>
        <p className="dashboard-subtitle">Generate AI-powered summaries of your content</p>
      </div>

      {error && <div className="error">{error}</div>}

      <SummaryInput onSubmit={handleContentSubmit} loading={loading} />

      {summary && <SummaryResult summary={summary} />}
    </div>
  );
};

export default Dashboard;
