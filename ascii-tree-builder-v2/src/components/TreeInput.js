import React, { useState } from 'react';
import { useTree } from '../TreeContext'; // Adjust the import path as necessary

const TreeInput = () => {
    const { nodes, addNode, selectNode, selectedNodeId, indentNode, unindentNode } = useTree();
    const [newNodeName, setNewNodeName] = useState('');

    const handleAddNode = () => {
        if (!newNodeName.trim()) return;
        addNode('root', newNodeName); // Example: Adding to 'root'
        setNewNodeName('');
    };

    const renderNode = (node, depth = 0) => {
        const isSelected = node.id === selectedNodeId;
        return (
            <div
                key={node.id}
                style={{
                    marginLeft: `${depth * 20}px`,
                    background: isSelected ? 'grey' : 'transparent',
                    cursor: 'pointer'
                }}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    selectNode(node.id);
                }}
            >
                {node.name}
                {nodes.filter(child => child.parentId === node.id).map(child => renderNode(child, depth + 1))}
            </div>
        );
    };


    return (
        <div>
            <div style={{overflowY: 'auto', height: '200px', border: '1px solid black', padding: '5px'}}>
                {nodes.filter(node => node.parentId === null).map(node => renderNode(node))}
            </div>
            <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="Enter new node name"
            />
            <button onClick={handleAddNode}>Add Node</button>
            <button onClick={() => selectedNodeId && indentNode(selectedNodeId)}>Indent</button>
            <button onClick={() => selectedNodeId && unindentNode(selectedNodeId)}>Unindent</button>
        </div>
    );
};

export default TreeInput;
