import React, {useState} from 'react';
import {useTree} from '../TreeContext';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {Button} from '@mui/material';

const TreeInput = () => {
    const {
        nodes,
        addNode,
        selectNode,
        selectedNodeId,
        indentNode,
        unindentNode,
        updateNodeType,
        deleteNode,
        moveNodeUp,
        moveNodeDown,
        importNodes,
    } = useTree();
    const [newNodeName, setNewNodeName] = useState('');

    const handleAddNode = () => {
        if (!newNodeName.trim()) return;
        const rootId = '1'; // Will not be required in future will replace with parent id of selected node
        addNode(rootId, newNodeName);
        setNewNodeName('');
    };

    const handleUpdateNodeType = (type) => {
        if (!selectedNodeId) return;
        updateNodeType(selectedNodeId, type);
    };

    const isLastChild = (nodeId) => {
        if (!nodeId) return false;
        const parentNodeId = nodes.find(node => node.id === nodeId)?.parentId;
        if (!parentNodeId) return false;
        const siblings = nodes.filter(node => node.parentId === parentNodeId);
        return siblings[siblings.length - 1].id === nodeId;
    };

    const isDescendantOfSelectedNode = (nodeId, selectedNodeId) => {
        if (!nodeId || !selectedNodeId) return false;
        let currentNode = nodes.find(node => node.id === nodeId);
        while (currentNode) {
            if (currentNode.id === selectedNodeId) return true;
            currentNode = nodes.find(node => node.id === currentNode.parentId);
        }
        return false;
    };

    const renderNode = (node, depth = 0, isDescendant = false) => {
        const isSelected = node.id === selectedNodeId;
        const isChildOfSelected = isDescendantOfSelectedNode(node.id, selectedNodeId);
        const children = nodes.filter(child => child.parentId === node.id);

        return (
            <div
                key={node.id}
                onClick={(e) => {
                    e.stopPropagation();
                    selectNode(node.id);
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Vertically stack children
                    cursor: 'pointer',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: isSelected ? 'grey' : isChildOfSelected || isDescendant ? 'lightgrey' : 'transparent',
                        paddingLeft: `${depth * 20}px`, // Indentation depth
                    }}
                >
                    <span>{node.name}</span>
                </div>
                {children.map((child) => renderNode(child, depth + 1, isSelected || isDescendant))}
            </div>
        );
    };

    const [asciiTreeInput, setAsciiTreeInput] = useState('');

    const handleImportNodes = () => {
        importNodes(asciiTreeInput);
        setAsciiTreeInput(''); // Clear input after import
    };

    return (
        <div style={{
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto',
            overflowY: 'auto',
        }}>
            <div style={{overflowY: 'auto', height: '400px', border: '1px solid black', padding: '5px'}}>
                {nodes.filter(node => node.parentId === null).map(node => renderNode(node))}
            </div>
            <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="Enter new node name"
            />
            <Button variant="contained" className="button-style" onClick={handleAddNode}>Add Node</Button>
            <Button variant="contained" className="button-style"
                    onClick={() => selectedNodeId && deleteNode(selectedNodeId)}>Delete Node</Button>
            <Button variant="contained" className="button-style"
                    onClick={() => selectedNodeId && moveNodeUp(selectedNodeId)}>↑</Button>
            <Button variant="contained" className="button-style"
                    onClick={() => selectedNodeId && moveNodeDown(selectedNodeId)}>↓</Button>
            <Button variant="contained" className="button-style"
                    onClick={() => selectedNodeId && indentNode(selectedNodeId)}>→</Button>
            <Button variant="contained" className="button-style"
                    onClick={() => selectedNodeId && unindentNode(selectedNodeId)}>←</Button>
            <Button variant="contained" className="button-style" onClick={() => handleUpdateNodeType('folder')}>
                <FolderIcon style={{verticalAlign: 'middle', marginRight: '5px'}}/>
                Set as Folder
            </Button>
            <Button variant="contained" className="button-style" onClick={() => handleUpdateNodeType('file')}>
                <InsertDriveFileIcon style={{verticalAlign: 'middle', marginRight: '5px'}}/>
                Set as File
            </Button>
            <textarea
                value={asciiTreeInput}
                onChange={(e) => setAsciiTreeInput(e.target.value)}
                placeholder="Paste ASCII tree here"
                style={{width: '100%', height: '100px'}}
            />
            <Button variant="contained" onClick={handleImportNodes}>Import Tree</Button>
        </div>
    );
};

export default TreeInput;
