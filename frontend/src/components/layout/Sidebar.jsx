import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link to="/dashboard" className="sidebar-link">
          <span className="sidebar-icon">📝</span>
          <span className="sidebar-text">Dashboard</span>
        </Link>
        <Link to="/history" className="sidebar-link">
          <span className="sidebar-icon">📚</span>
          <span className="sidebar-text">History</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
