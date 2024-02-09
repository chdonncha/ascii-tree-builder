import React from 'react';
import { useTree } from '../TreeContext';

const TreeOutput = () => {
    const { nodes } = useTree(); // Assuming nodes contain your tree structure

    const buildAsciiTree = (nodeId = null, prefix = '', isLast = true) => {
        // Filter nodes to find children of the current node
        const children = nodes.filter(node => node.parentId === nodeId);
        return children.map((node, index, arr) => {
            const isLastChild = index === arr.length - 1;
            // Build the prefix for child nodes
            const nextPrefix = `${prefix}${isLast ? '    ' : '│   '}`;
            const linePrefix = `${prefix}${isLastChild ? '└── ' : '├── '}`;
            // Recursively build tree for child nodes
            const childTree = buildAsciiTree(node.id, nextPrefix, isLastChild);
            return `${linePrefix}${node.name}\n${childTree}`;
        }).join('');
    };

    // Start building the tree from root nodes (nodes without a parentId)
    const asciiTree = buildAsciiTree();

    return (
        <div>
            <pre>Tree ASCII Representation Here</pre>
            <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'keep-all'}}>
                {asciiTree || 'Tree is empty'}
            </pre>
        </div>
    );
};

export default TreeOutput;
