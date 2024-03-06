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
        <button onClick={handleCopy}>Copy</button>
    );
};

export default CopyButton;