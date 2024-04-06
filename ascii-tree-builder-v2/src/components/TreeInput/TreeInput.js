import React, {useState} from 'react';
import {useTree} from '../../TreeContext';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {Button} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

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
        clearAllNodes,
        undoAction,
        redoAction,
    } = useTree();
    const [newNodeName, setNewNodeName] = useState('');
    const [openAddNode, setOpenAddNode] = useState(false);
    const [openImportNodes, setOpenImportNodes] = useState(false);

    const handleAddNode = () => {
        if (!newNodeName.trim()) return;
        // Use selectedNodeId as parentId; if none is selected, or if there are no nodes, use null
        const parentId = selectedNodeId ? selectedNodeId : null;
        addNode(parentId, newNodeName);
        setNewNodeName('');
    };

    const handleUpdateNodeType = (type) => {
        if (!selectedNodeId) return;
        updateNodeType(selectedNodeId, type);
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
            <Button variant="contained" className="button-style" onClick={() => setOpenAddNode(true)}>Add Node</Button>
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
            <Button variant="contained" color="error" className="button-style" onClick={clearAllNodes}>
                Clear
            </Button>
            <Dialog open={openAddNode} onClose={() => setOpenAddNode(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add New Node</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Node Name"
                        type="text"
                        fullWidth
                        value={newNodeName}
                        onChange={(e) => setNewNodeName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddNode(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {handleAddNode(); setOpenAddNode(false);}} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Button variant="contained" color="primary" className="button-style" onClick={() => setOpenImportNodes(true)}>Import Tree</Button>
            <Dialog open={openImportNodes} onClose={() => setOpenImportNodes(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Import Nodes</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="asciiTree"
                        label="ASCII Tree"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={asciiTreeInput}
                        onChange={(e) => setAsciiTreeInput(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenImportNodes(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {handleImportNodes(); setOpenImportNodes(false);}} color="primary">
                        Import
                    </Button>
                </DialogActions>
            </Dialog>
            <Button variant="contained" color="primary" className="button-style" onClick={undoAction}>
                Undo
            </Button>
            <Button variant="contained" color="primary" className="button-style" onClick={redoAction}>
                Redo
            </Button>
        </div>
    );
};

export default TreeInput;
