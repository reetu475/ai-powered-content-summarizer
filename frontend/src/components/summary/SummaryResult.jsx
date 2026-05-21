import Card from '../common/Card';
import './SummaryResult.css';

const SummaryResult = ({ summary }) => {
  if (!summary) return null;

  const { summaries } = summary;

  return (
    <div className="summary-result">
      <h2 className="summary-result-title">Summary Results</h2>
      
      <Card className="summary-section">
        <h3 className="summary-section-title">Short Summary</h3>
        <p className="summary-section-content">{summaries.short}</p>
      </Card>

      <Card className="summary-section">
        <h3 className="summary-section-title">Detailed Summary</h3>
        <p className="summary-section-content">{summaries.detailed}</p>
      </Card>

      <Card className="summary-section">
        <h3 className="summary-section-title">Bullet Points</h3>
        <ul className="summary-section-list">
          {summaries.bulletPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </Card>

      <Card className="summary-section">
        <h3 className="summary-section-title">Keywords</h3>
        <div className="summary-section-keywords">
          {summaries.keywords.map((keyword, index) => (
            <span key={index} className="keyword-tag">{keyword}</span>
          ))}
        </div>
      </Card>

      <Card className="summary-section">
        <h3 className="summary-section-title">Action Items</h3>
        <ol className="summary-section-list">
          {summaries.actionItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </Card>

      <Card className="summary-section">
        <h3 className="summary-section-title">Topic Analysis</h3>
        <p className="summary-section-content">{summaries.topicAnalysis}</p>
      </Card>

      <Card className="summary-section">
        <h3 className="summary-section-title">Strengths & Weaknesses</h3>
        <p className="summary-section-content">{summaries.strengthsWeaknesses}</p>
      </Card>
    </div>
  );
};

export default SummaryResult;
