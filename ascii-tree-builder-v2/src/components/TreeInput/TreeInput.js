import React, { useState, useEffect, useRef } from 'react';
import { useTree } from '../../TreeContext';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import './TreeInput.scss';

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
    canUndo,
    canRedo,
  } = useTree();
  const [newNodeName, setNewNodeName] = useState('');
  const [openAddNode, setOpenAddNode] = useState(false);
  const [openImportNodes, setOpenImportNodes] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        if (selectedNodeId) {
          selectNode(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedNodeId]);

  const findNodeIndexAndParent = (nodeId) => {
    const parentNode = nodes.find(
      (node) => node.id === nodes.find((node) => node.id === nodeId)?.parentId
    );
    const siblings = parentNode
      ? nodes.filter((node) => node.parentId === parentNode.id)
      : nodes.filter((node) => node.parentId === null);
    const nodeIndex = siblings.findIndex((node) => node.id === nodeId);
    return { nodeIndex, siblings, parentNode };
  };

  const canMoveUp = (selectedNodeId) => {
    const { nodeIndex } = findNodeIndexAndParent(selectedNodeId);
    return nodeIndex > 0;
  };

  const canMoveDown = (selectedNodeId) => {
    const { nodeIndex, siblings } = findNodeIndexAndParent(selectedNodeId);
    return nodeIndex < siblings.length - 1;
  };

  const canIndent = (selectedNodeId) => {
    const { nodeIndex } = findNodeIndexAndParent(selectedNodeId);
    return nodeIndex > 0;
  };

  const canUnindent = (selectedNodeId) => {
    return nodes.find((node) => node.id === selectedNodeId)?.parentId !== null;
  };

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
    let currentNode = nodes.find((node) => node.id === nodeId);
    while (currentNode) {
      if (currentNode.id === selectedNodeId) return true;
      currentNode = nodes.find((node) => node.id === currentNode.parentId);
    }
    return false;
  };

  const renderNode = (node, depth = 0, isDescendant = false) => {
    const isSelected = node.id === selectedNodeId;
    const isChildOfSelected = isDescendantOfSelectedNode(
      node.id,
      selectedNodeId
    );
    const children = nodes.filter((child) => child.parentId === node.id);

    return (
      <div
        className="vertically-stack-children"
        key={node.id}
        onClick={(e) => {
          e.stopPropagation();
          selectNode(node.id);
        }}
      >
        <div
          className={`node-item ${
            isSelected
              ? 'selected'
              : isChildOfSelected || isDescendant
              ? 'child-or-descendant'
              : 'default'
          }`}
          style={{ paddingLeft: `${depth * 20}px` }}
        >
          <span>{node.name}</span>
        </div>
        {children.map((child) =>
          renderNode(child, depth + 1, isSelected || isDescendant)
        )}
      </div>
    );
  };

  const [asciiTreeInput, setAsciiTreeInput] = useState('');

  const handleImportNodes = () => {
    importNodes(asciiTreeInput);
    setAsciiTreeInput(''); // Clear input after import
  };

  return (
    <div ref={componentRef} className="input-box-size">
      <div className="input-box-styling">
        {nodes
          .filter((node) => node.parentId === null)
          .map((node) => renderNode(node))}
      </div>
      <Button
        variant="contained"
        className="button-style"
        onClick={() => setOpenAddNode(true)}
      >
        Add Node
      </Button>
      <Button
        variant="contained"
        color="error"
        className="button-style"
        disabled={!selectedNodeId}
        onClick={() => selectedNodeId && deleteNode(selectedNodeId)}
      >
        Delete Node
      </Button>
      <Button
        variant="contained"
        className="button-style"
        disabled={!selectedNodeId || !canMoveUp(selectedNodeId)}
        onClick={() => moveNodeUp(selectedNodeId)}
      >
        ↑
      </Button>
      <Button
        variant="contained"
        className="button-style"
        disabled={!selectedNodeId || !canMoveDown(selectedNodeId)}
        onClick={() => moveNodeDown(selectedNodeId)}
      >
        ↓
      </Button>
      <Button
        variant="contained"
        className="button-style"
        disabled={!selectedNodeId || !canIndent(selectedNodeId)}
        onClick={() => indentNode(selectedNodeId)}
      >
        →
      </Button>
      <Button
        variant="contained"
        className="button-style"
        disabled={!selectedNodeId || !canUnindent(selectedNodeId)}
        onClick={() => unindentNode(selectedNodeId)}
      >
        ←
      </Button>
      {/*<Button variant="contained" className="button-style" onClick={() => handleUpdateNodeType('folder')}>*/}
      {/*    <FolderIcon className="icon-alignment "/>*/}
      {/*    Set as Folder*/}
      {/*</Button>*/}
      {/*<Button variant="contained" className="button-style" onClick={() => handleUpdateNodeType('file')}>*/}
      {/*    <InsertDriveFileIcon className="icon-alignment"/>*/}
      {/*    Set as File*/}
      {/*</Button>*/}
      <Button
        variant="contained"
        color="error"
        className="button-style"
        onClick={clearAllNodes}
      >
        Clear
      </Button>
      <Dialog
        open={openAddNode}
        onClose={() => setOpenAddNode(false)}
        aria-labelledby="form-dialog-title"
      >
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
          <Button
            onClick={() => {
              handleAddNode();
              setOpenAddNode(false);
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        color="primary"
        className="button-style"
        onClick={() => setOpenImportNodes(true)}
      >
        Import Tree
      </Button>
      <Dialog
        open={openImportNodes}
        onClose={() => setOpenImportNodes(false)}
        aria-labelledby="form-dialog-title"
      >
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
          <Button
            onClick={() => {
              handleImportNodes();
              setOpenImportNodes(false);
            }}
            color="primary"
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        color="primary"
        className="button-style"
        onClick={undoAction}
        disabled={!canUndo}
      >
        Undo
      </Button>
      <Button
        variant="contained"
        color="primary"
        className="button-style"
        onClick={redoAction}
        disabled={!canRedo}
      >
        Redo
      </Button>
    </div>
  );
};

export default TreeInput;
