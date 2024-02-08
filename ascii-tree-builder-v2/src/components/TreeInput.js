import React, { useState, useEffect } from 'react';
import { useTree } from '../TreeContext'; // Adjust the import path according to your file structure

const TreeInput = () => {
    const { nodes, addNode } = useTree();
    const [newNodeName, setNewNodeName] = useState('');
    const [treeDisplay, setTreeDisplay] = useState('');

    useEffect(() => {
        // Function to convert the tree structure to a string representation
        const displayTree = (nodes, parentId = null, depth = 0) => {
            return nodes
                .filter(node => node.parentId === parentId)
                .map(node => {
                    const prefix = ' '.repeat(depth * 2); // Indentation for children
                    const childrenDisplay = displayTree(nodes, node.id, depth + 1);
                    return `${prefix}${node.name}\n${childrenDisplay}`;
                })
                .join('');
        };

        setTreeDisplay(displayTree(nodes));
    }, [nodes]); // Update the display whenever the nodes change

    const handleAddNode = () => {
        if (!newNodeName.trim()) return; // Prevent adding empty named nodes
        addNode('root', newNodeName); // Assuming 'root' is the id of the root node
        setNewNodeName(''); // Reset input field
    };

    return (
        <div>
            <textarea readOnly value={treeDisplay} style={{ width: '100%', minHeight: '200px' }} />
            <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="Enter new node name"
            />
            <button onClick={handleAddNode}>Add Node</button>
        </div>
    );
};

export default TreeInput;
