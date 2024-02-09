import React, { useState } from 'react';
import { useTree } from '../TreeContext';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';


const TreeInput = () => {
    const { nodes, addNode, selectNode, selectedNodeId, indentNode, unindentNode } = useTree();
    const [newNodeName, setNewNodeName] = useState('');

    const handleAddNode = () => {
        if (!newNodeName.trim()) return;
        addNode('root', newNodeName); // Example: Adding to 'root'
        setNewNodeName('');
    };

    const isLastChild = (nodeId) => {
        if (!nodeId) return false;
        const parentNodeId = nodes.find(node => node.id === nodeId)?.parentId;
        if (!parentNodeId) return false;
        const siblings = nodes.filter(node => node.parentId === parentNodeId);
        return siblings[siblings.length - 1].id === nodeId;
    };

    const renderPrefix = (depth, isLast) => {
        let prefix = '';
        for (let i = 0; i < depth; i++) {
            prefix += i === depth - 1 ? (isLast ? '└── ' : '├── ') : '│   ';
        }
        return prefix;
    };

    const renderNode = (node, depth = 0) => {
        const isSelected = node.id === selectedNodeId;
        const children = nodes.filter(child => child.parentId === node.id);
        const isLast = isLastChild(node.id);
        const prefix = depth > 0 ? renderPrefix(depth, isLast) : '';

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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>{prefix}</span>
                    {node.type === 'file' ? (
                        <InsertDriveFileIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    ) : (
                        <FolderIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    )}
                    <span>{node.name}</span>
                </div>
                {children.map((child, index) => renderNode(child, depth + 1))}
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
