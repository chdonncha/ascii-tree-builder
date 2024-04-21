import React from 'react';
import { Button } from '@mui/material';

const CopyButton = ({ textToCopy, onCopy }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      onCopy();
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      className="button-style"
      onClick={handleCopy}
    >
      Copy
    </Button>
  );
};

export default CopyButton;
