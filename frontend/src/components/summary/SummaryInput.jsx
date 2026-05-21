import { useState } from 'react';
import TextInput from '../content/TextInput';
import URLInput from '../content/URLInput';
import FileUpload from '../content/FileUpload';
import AudioInput from '../content/AudioInput';
import VideoInput from '../content/VideoInput';
import './SummaryInput.css';

const SummaryInput = ({ onSubmit, loading }) => {
  const [activeTab, setActiveTab] = useState('text');

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="summary-input">
      <div className="summary-tabs">
        <button
          className={`tab ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Text
        </button>
        <button
          className={`tab ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          URL
        </button>
        <button
          className={`tab ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => setActiveTab('file')}
        >
          File
        </button>
        <button
          className={`tab ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          Audio
        </button>
        <button
          className={`tab ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          Video
        </button>
      </div>

      <div className="summary-content">
        {activeTab === 'text' && <TextInput onSubmit={handleSubmit} loading={loading} />}
        {activeTab === 'url' && <URLInput onSubmit={handleSubmit} loading={loading} />}
        {activeTab === 'file' && <FileUpload onSubmit={handleSubmit} loading={loading} />}
        {activeTab === 'audio' && <AudioInput onSubmit={handleSubmit} loading={loading} />}
        {activeTab === 'video' && <VideoInput onSubmit={handleSubmit} loading={loading} />}
      </div>
    </div>
  );
};

export default SummaryInput;
