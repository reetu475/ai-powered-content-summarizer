import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const URLInput = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit({ content: url, contentType: 'url' });
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="content-input-form">
      <Input
        type="url"
        name="url"
        placeholder="Enter URL to summarize (e.g., https://example.com/article)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="content-submit-button"
      >
        Scrape & Summarize
      </Button>
    </form>
  );
};

export default URLInput;
