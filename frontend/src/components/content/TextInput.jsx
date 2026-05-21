import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const TextInput = ({ onSubmit, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({ content: text, contentType: 'text' });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="content-input-form">
      <Input
        type="textarea"
        name="text"
        placeholder="Paste or type your content here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="content-textarea"
        style={{ minHeight: '200px', resize: 'vertical' }}
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="content-submit-button"
      >
        Generate Summary
      </Button>
    </form>
  );
};

export default TextInput;
