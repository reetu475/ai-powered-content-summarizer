import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">AI-Powered Content Summarizer</h1>
        <p className="hero-subtitle">
          Transform lengthy content into concise, actionable insights using Groq AI
        </p>
        <div className="hero-actions">
          <Link to="/dashboard">
            <Button variant="primary" size="lg">Get Started</Button>
          </Link>
        </div>
      </div>

      <div className="features">
        <h2 className="features-title">Features</h2>
        <div className="features-grid">
          <Card className="feature-card">
            <div className="feature-icon">📝</div>
            <h3 className="feature-title">Multiple Summary Types</h3>
            <p className="feature-description">
              Get short summaries, detailed breakdowns, bullet points, keywords, action items, topic analysis, and strengths & weaknesses.
            </p>
          </Card>
          <Card className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3 className="feature-title">URL Scraping</h3>
            <p className="feature-description">
              Paste any URL and we'll extract the content and generate comprehensive summaries.
            </p>
          </Card>
          <Card className="feature-card">
            <div className="feature-icon">📁</div>
            <h3 className="feature-title">File Upload</h3>
            <p className="feature-description">
              Upload PDF, DOCX, TXT, audio, or video files and get instant AI-powered summaries.
            </p>
          </Card>
          <Card className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Smart Search</h3>
            <p className="feature-description">
              Search through your summary history with semantic search powered by Pinecone.
            </p>
          </Card>
          <Card className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Action Items</h3>
            <p className="feature-description">
              Automatically extract actionable tasks and next steps from your content.
            </p>
          </Card>
          <Card className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Topic Analysis</h3>
            <p className="feature-description">
              Understand the main themes and topics in your content with AI analysis.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
