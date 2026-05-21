import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import './VideoInput.css';

const VideoInput = ({ onSubmit, loading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

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
    formData.append('contentType', 'video');

    onSubmit({
      content: file.name,
      contentType: 'video',
      originalContent: file.name,
      file: formData
    });
  };

  return (
    <div className="video-input">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="video">Upload Video File</label>
          <Input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {preview && (
          <div className="video-preview">
            <video controls src={preview} className="video-player" />
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

export default VideoInput;
