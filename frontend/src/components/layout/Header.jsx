import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          AI Summarizer
        </Link>
        <nav className="header-nav">
          <Link to="/" className="header-link">Home</Link>
          <Link to="/dashboard" className="header-link">Dashboard</Link>
          <Link to="/history" className="header-link">History</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
