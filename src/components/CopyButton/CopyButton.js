import { Button } from '@mui/material';
import React from 'react';

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

export { CopyButton };
