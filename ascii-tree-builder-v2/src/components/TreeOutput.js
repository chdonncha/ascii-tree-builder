import React, { useState } from 'react';
import { useTree } from '../TreeContext';
import CopyButton from './CopyButton';

const TreeOutput = () => {
    const { nodes } = useTree();
    const [copySuccess, setCopySuccess] = useState('');

    const buildAsciiTree = (nodeId = null, prefix = '', isLast = true) => {
        // Filter nodes to find children of the current node
        const children = nodes.filter(node => node.parentId === nodeId);

        return children.map((node, index, arr) => {
            const isLastChild = index === arr.length - 1;
            const nextPrefix = `${prefix}${isLastChild ? '    ' : '│   '}`;
            const spacer = children.length > 1 && !isLastChild ? '' : '';
            const linePrefix = `${prefix}${spacer}${isLastChild ? '└── ' : '├── '}`;
            const childTree = buildAsciiTree(node.id, nextPrefix, isLastChild);
            return `${linePrefix}${node.name}\n${childTree}`;
        }).join('');
    };

    const handleCopySuccess = () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2 seconds
    };

    const asciiTree = buildAsciiTree();

    return (
        <>
            <div>
                <pre>Tree ASCII Representation Here</pre>
                <CopyButton textToCopy={asciiTree} onCopy={handleCopySuccess}/>
                {copySuccess && <div>{copySuccess}</div>}
            </div>

            <div style={{
                overflowY: 'auto',
                height: '400px',
                border: '1px solid black',
                padding: '5px',
                textAlign: 'left',
                width: '50%',
                marginLeft: 'auto',
                marginRight: 'auto',
            }}>
                <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'keep-all',
                    margin: 0,
                }}>
                {asciiTree || 'Tree is empty'}
            </pre>
            </div>
        </>
    );
};

export default TreeOutput;
