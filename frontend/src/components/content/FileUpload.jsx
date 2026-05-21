import { useState } from 'react';
import Button from '../common/Button';

const FileUpload = ({ onSubmit, loading }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const getContentType = (selectedFile) => {
    if (selectedFile.type.startsWith('audio/')) return 'audio';
    if (selectedFile.type.startsWith('video/')) return 'video';
    const ext = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.webm', '.mpeg', '.mpga', '.opus'].includes(ext)) {
      return 'audio';
    }
    if (['.mp4', '.mov', '.avi', '.mkv', '.webm', '.mpeg', '.mpg', '.wmv', '.m4v'].includes(ext)) {
      return 'video';
    }
    return 'file';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const contentType = getContentType(file);
    const formData = new FormData();
    formData.append('file', file);

    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        await onSubmit({
          content: event.target.result,
          contentType: 'file',
          originalContent: file.name
        });
      };
      reader.readAsText(file);
    } else {
      await onSubmit({
        content: file.name,
        contentType,
        originalContent: file.name,
        fileData: formData
      });
    }

    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="content-input-form">
      <div className="file-upload-area">
        <input
          type="file"
          id="file-upload"
          accept=".txt,.pdf,.doc,.docx,.mp3,.wav,.ogg,.m4a,.flac,.mp4,.mov,.avi,.mkv,.webm"
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="file-upload" className="file-upload-label">
          <div className="file-upload-icon">📁</div>
          <div className="file-upload-text">
            {file ? file.name : 'Click to upload or drag and drop'}
          </div>
          <div className="file-upload-subtext">
            TXT, PDF, DOCX, audio, or video (max 25MB)
          </div>
        </label>
      </div>
      {file && (
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="content-submit-button mt-4"
        >
          Upload & Summarize
        </Button>
      )}
    </form>
  );
};

export default FileUpload;
