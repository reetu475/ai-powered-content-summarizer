import { useState, useEffect } from 'react';
import { summaryAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './History.css';

const History = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    try {
      setLoading(true);
      const response = await summaryAPI.getHistory();
      setSummaries(response.data.summaries);
    } catch (err) {
      setError('Failed to load summaries');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadSummaries();
      return;
    }

    try {
      setLoading(true);
      const response = await summaryAPI.search(searchQuery);
      setSummaries(response.data.summaries);
    } catch (err) {
      setError('Failed to search summaries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) {
      return;
    }

    try {
      await summaryAPI.deleteSummary(id);
      loadSummaries();
    } catch (err) {
      setError('Failed to delete summary');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="history">
      <div className="history-header">
        <h1 className="history-title">Summary History</h1>
        <p className="history-subtitle">View and search your past summaries</p>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search summaries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <Button type="submit" variant="primary">Search</Button>
      </form>

      <div className="history-list">
        {summaries.length === 0 ? (
          <p className="no-summaries">No summaries found</p>
        ) : (
          summaries.map((summary) => (
            <Card key={summary.id} className="history-card">
              <div className="history-card-header">
                <h3 className="history-card-title">
                  {summary.contentType === 'url' ? 'URL' : summary.contentType === 'file' ? 'File' : 'Text'} Summary
                </h3>
                <span className="history-card-date">
                  {new Date(summary.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="history-card-preview">
                {summary.summaries.short}
              </p>
              <div className="history-card-actions">
                <Button variant="secondary" onClick={() => window.location.href = `/dashboard?summaryId=${summary.id}`}>
                  View
                </Button>
                <Button variant="danger" onClick={() => handleDelete(summary.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
