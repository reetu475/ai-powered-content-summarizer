import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import './AudioInput.css';

const AudioInput = ({ onSubmit, loading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState('en');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', 'audio');
    formData.append('language', language);

    onSubmit({
      content: file.name,
      contentType: 'audio',
      originalContent: file.name,
      file: formData
    });
  };

  return (
    <div className="audio-input">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="audio">Upload Audio File</label>
          <Input
            type="file"
            id="audio"
            accept="audio/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="language">Spoken Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field select-field"
            style={{ width: '100%', cursor: 'pointer' }}
          >
            <option value="en">English (Recommended)</option>
            <option value="auto">Auto-Detect</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="hi">Hindi</option>
            <option value="ur">Urdu</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
          </select>
        </div>

        {preview && (
          <div className="audio-preview">
            <audio controls src={preview} className="audio-player" />
            <p className="file-name">{file.name}</p>
          </div>
        )}

        <Button type="submit" variant="primary" disabled={!file || loading} className="submit-button">
          {loading ? 'Processing...' : 'Generate Summary'}
        </Button>
      </form>
    </div>
  );
};

export default AudioInput;
