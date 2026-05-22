import { useState } from 'react';
import Card from '../common/Card';
import './SummaryResult.css';

const SummaryResult = ({ summary }) => {
  const [showTranscript, setShowTranscript] = useState(false);

  if (!summary) return null;

  const { summaries } = summary;

  return (
    <div className="summary-result">
      <h2 className="summary-result-title">Summary Results</h2>
      
      <div className="summary-content">
        <Card className="summary-section">
          <h3 className="summary-section-title">Short Summary</h3>
          <p className="summary-text">{summaries.short}</p>
        </Card>

        <Card className="summary-section">
          <h3 className="summary-section-title">Detailed Summary</h3>
          <p className="summary-text">{summaries.detailed}</p>
        </Card>

        {summaries.bulletPoints && summaries.bulletPoints.length > 0 && (
          <Card className="summary-section">
            <h3 className="summary-section-title">Bullet Points</h3>
            <ul className="summary-bullets">
              {summaries.bulletPoints.map((point, index) => (
                <li key={index} className="summary-bullet">{point}</li>
              ))}
            </ul>
          </Card>
        )}

        {summaries.keywords && summaries.keywords.length > 0 && (
          <Card className="summary-section">
            <h3 className="summary-section-title">Keywords</h3>
            <div className="summary-keywords">
              {summaries.keywords.map((keyword, index) => (
                <span key={index} className="summary-keyword">{keyword}</span>
              ))}
            </div>
          </Card>
        )}

        {summaries.actionItems && summaries.actionItems.length > 0 && (
          <Card className="summary-section">
            <h3 className="summary-section-title">Action Items</h3>
            <ol className="summary-actions">
              {summaries.actionItems.map((item, index) => (
                <li key={index} className="summary-action">{item}</li>
              ))}
            </ol>
          </Card>
        )}

        {summaries.topicAnalysis && (
          <Card className="summary-section">
            <h3 className="summary-section-title">Topic Analysis</h3>
            <p className="summary-text">{summaries.topicAnalysis}</p>
          </Card>
        )}

        {summaries.strengthsWeaknesses && (
          <Card className="summary-section">
            <h3 className="summary-section-title">Strengths & Weaknesses</h3>
            <p className="summary-text">{summaries.strengthsWeaknesses}</p>
          </Card>
        )}

        {summary.content && (
          <Card className="summary-section transcript-section">
            <div 
              className="transcript-header" 
              onClick={() => setShowTranscript(!showTranscript)}
            >
              <h3 className="summary-section-title" style={{ margin: 0 }}>
                {summary.contentType === 'audio' || summary.contentType === 'video' 
                  ? 'Original Transcript' 
                  : 'Source Content'}
              </h3>
              <span className={`accordion-icon ${showTranscript ? 'open' : ''}`}>
                {showTranscript ? '▼' : '▶'}
              </span>
            </div>
            {showTranscript && (
              <div className="transcript-content-wrapper mt-2">
                <p className="summary-text transcript-text">{summary.content}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default SummaryResult;
