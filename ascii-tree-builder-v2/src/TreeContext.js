import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SAMPLE_TREE_DATA } from './utils/sampleTreeData';
import { v4 as uuidv4 } from 'uuid';
import HistoryManager from './components/HistoryManager/HistoryManager';

const TreeContext = createContext();

export const useTree = () => useContext(TreeContext);

export const TreeProvider = ({ children }) => {
  const [nodes, setNodes] = useState(SAMPLE_TREE_DATA);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const historyManager = useRef(new HistoryManager()).current;
  const [canUndo, setCanUndo] = useState(historyManager.canUndo());
  const [canRedo, setCanRedo] = useState(historyManager.canRedo());

  useEffect(() => {
    setCanUndo(historyManager.canUndo());
    setCanRedo(historyManager.canRedo());
  }, []);

  const addNode = (parentId, name) => {
    historyManager.pushState([...nodes]);
    const newNode = {
      id: uuidv4(),
      parentId,
      name,
      type: null,
    };
    const newState = [...nodes, newNode];
    setNodes(newState);
    updateHistoryStates();
  };

  const deleteNode = (nodeId) => {
    historyManager.pushState([...nodes]);

    const getAllDescendants = (nodeId, nodes) => {
      const directChildren = nodes.filter((node) => node.parentId === nodeId);
      return directChildren.reduce((acc, child) => {
        return [...acc, child.id, ...getAllDescendants(child.id, nodes)];
      }, []);
    };

    const nodeIdsToDelete = getAllDescendants(nodeId, nodes);
    nodeIdsToDelete.push(nodeId);

    setNodes((prevNodes) => prevNodes.filter((node) => !nodeIdsToDelete.includes(node.id)));

    if (nodeId === selectedNodeId) {
      setSelectedNodeId(null);
    }
    updateHistoryStates();
  };

  const selectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
  };

  const updateNodeType = (nodeId, type) => {
    setNodes((prevNodes) => prevNodes.map((node) => (node.id === nodeId ? { ...node, type } : node)));
  };

  const indentNode = (nodeId) => {
    historyManager.pushState([...nodes]);
    setNodes((prevNodes) => {
      const nodeIndex = prevNodes.findIndex((node) => node.id === nodeId);
      if (nodeIndex > 0) {
        const node = prevNodes[nodeIndex];
        const siblings = prevNodes.filter((n) => n.parentId === node.parentId);
        const nodeSiblingIndex = siblings.findIndex((n) => n.id === nodeId);
        if (nodeSiblingIndex > 0) {
          const newParentId = siblings[nodeSiblingIndex - 1].id;
          return prevNodes.map((node) => (node.id === nodeId ? { ...node, parentId: newParentId } : node));
        }
      }
      return prevNodes;
    });
    updateHistoryStates();
  };

  const unindentNode = (nodeId) => {
    historyManager.pushState([...nodes]);
    setNodes((prevNodes) => {
      const node = prevNodes.find((node) => node.id === nodeId);
      const parentNode = prevNodes.find((parent) => parent.id === node.parentId);
      if (parentNode) {
        const newParentId = parentNode.parentId;
        const updatedNodes = prevNodes.map((node) => (node.id === nodeId ? { ...node, parentId: newParentId } : node));
        return updatedNodes;
      }
      return prevNodes;
    });
    updateHistoryStates();
  };

  const moveNodeUp = (nodeId) => {
    historyManager.pushState([...nodes]);
    setNodes((prevNodes) => {
      const nodeIndex = prevNodes.findIndex((node) => node.id === nodeId);
      if (nodeIndex > 0) {
        const node = prevNodes[nodeIndex];
        const siblings = prevNodes.filter((n) => n.parentId === node.parentId);
        const siblingIndex = siblings.findIndex((n) => n.id === nodeId);
        if (siblingIndex > 0) {
          // Swap with the previous sibling
          const newNodes = [...prevNodes];
          const prevSiblingIndex = prevNodes.findIndex((n) => n.id === siblings[siblingIndex - 1].id);
          [newNodes[nodeIndex], newNodes[prevSiblingIndex]] = [newNodes[prevSiblingIndex], newNodes[nodeIndex]];
          return newNodes;
        }
      }
      return prevNodes;
    });
    updateHistoryStates();
  };

  const moveNodeDown = (nodeId) => {
    historyManager.pushState([...nodes]);
    setNodes((prevNodes) => {
      const nodeIndex = prevNodes.findIndex((node) => node.id === nodeId);
      const node = prevNodes[nodeIndex];
      const siblings = prevNodes.filter((n) => n.parentId === node.parentId);
      const siblingIndex = siblings.findIndex((n) => n.id === nodeId);
      if (siblingIndex < siblings.length - 1) {
        // Swap with the next sibling
        const newNodes = [...prevNodes];
        const nextSiblingIndex = prevNodes.findIndex((n) => n.id === siblings[siblingIndex + 1].id);
        [newNodes[nodeIndex], newNodes[nextSiblingIndex]] = [newNodes[nextSiblingIndex], newNodes[nodeIndex]];
        return newNodes;
      }
      return prevNodes;
    });
    updateHistoryStates();
  };

  function parseAsciiTreeToNodes(asciiTree) {
    const lines = asciiTree.split('\n'); // Split the ASCII tree into lines
    let nodes = [];
    let parentStack = [{ id: 'root', depth: -1 }]; // Initialize with a root-level pseudo-parent

    lines.forEach((line, index) => {
      if (line.trim() === '') return; // Skip empty lines

      // Determine the depth based on indentation ('    ' or '│   ')
      const depth = (line.match(/(    |│   )/g) || []).length;

      // Correctly extract the node name
      const nameMatch = line.match(/(├── |└── )(.*)/);
      if (!nameMatch) return; // Skip if the line format is not as expected
      const name = nameMatch[2];

      while (parentStack.length - 1 > depth) {
        parentStack.pop();
      }

      const parentNode = parentStack[parentStack.length - 1];

      const newNode = {
        id: uuidv4(),
        parentId: parentNode.id === 'root' ? null : parentNode.id,
        name,
        type: name.includes('.') ? 'file' : 'folder',
      };

      nodes.push(newNode);

      // Determine if this node will be a parent
      if (index + 1 < lines.length) {
        const nextLine = lines[index + 1];
        const nextDepth = (nextLine.match(/(    |│   )/g) || []).length;
        if (nextDepth > depth) {
          parentStack.push({ id: newNode.id, depth: depth });
        }
      }
    });

    return nodes.filter((node) => node.id !== 'root'); // Ensure we don't include the pseudo-parent
  }

  const importNodes = (asciiTree) => {
    historyManager.pushState([...nodes]);

    const parsedNodes = parseAsciiTreeToNodes(asciiTree);
    setNodes(parsedNodes);
  };

  const clearAllNodes = () => {
    historyManager.pushState([...nodes]);

    setNodes([]);
    setSelectedNodeId(null);
  };

  const updateHistoryStates = () => {
    setCanUndo(historyManager.canUndo());
    setCanRedo(historyManager.canRedo());
  };

  const undoAction = () => {
    const prevState = historyManager.undo(nodes);
    if (prevState !== null) {
      setNodes(prevState);
      updateHistoryStates();
    }
  };

  const redoAction = () => {
    const nextState = historyManager.redo(nodes);
    if (nextState !== null) {
      setNodes(nextState);
      updateHistoryStates();
    }
  };

  return (
    <TreeContext.Provider
      value={{
        nodes,
        addNode,
        selectNode,
        selectedNodeId,
        updateNodeType,
        indentNode,
        unindentNode,
        deleteNode,
        moveNodeUp,
        moveNodeDown,
        importNodes,
        clearAllNodes,
        undoAction,
        redoAction,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};
