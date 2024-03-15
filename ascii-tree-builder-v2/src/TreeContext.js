import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import { SAMPLE_TREE_DATA } from './utils/sampleTreeData';
import { v4 as uuidv4 } from 'uuid';
import HistoryManager from './components/HistoryManager';

const TreeContext = createContext();

export const useTree = () => useContext(TreeContext);

export const TreeProvider = ({ children }) => {
    const [nodes, setNodes] = useState(SAMPLE_TREE_DATA); // Initialize with SAMPLE_TREE_DATA
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const historyManager = useRef(new HistoryManager()).current;

    useEffect(() => {
        historyManager.pushState(SAMPLE_TREE_DATA);
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
    };

    const deleteNode = (nodeId) => {
        historyManager.pushState([...nodes]); // Save current state before change

        const getAllDescendants = (nodeId, nodes) => {
            const directChildren = nodes.filter(node => node.parentId === nodeId);
            return directChildren.reduce((acc, child) => {
                return [...acc, child.id, ...getAllDescendants(child.id, nodes)];
            }, []);
        };

        const nodeIdsToDelete = getAllDescendants(nodeId, nodes);
        nodeIdsToDelete.push(nodeId);

        setNodes(prevNodes => prevNodes.filter(node => !nodeIdsToDelete.includes(node.id)));
    };

    const selectNode = (nodeId) => {
        setSelectedNodeId(nodeId);
    };

    const updateNodeType = (nodeId, type) => {
        setNodes((prevNodes) => prevNodes.map(node =>
            node.id === nodeId ? { ...node, type } : node
        ));
    };

    const indentNode = (nodeId) => {
        setNodes((prevNodes) => {
            const nodeIndex = prevNodes.findIndex(node => node.id === nodeId);
            // Ensure the node is not the first node and has a previous sibling within the same parent
            if (nodeIndex > 0) {
                const node = prevNodes[nodeIndex];
                const siblings = prevNodes.filter(n => n.parentId === node.parentId);
                const nodeSiblingIndex = siblings.findIndex(n => n.id === nodeId);
                if (nodeSiblingIndex > 0) { // Ensure there is a previous sibling to become the parent
                    const newParentId = siblings[nodeSiblingIndex - 1].id;
                    return prevNodes.map(node => node.id === nodeId ? { ...node, parentId: newParentId } : node);
                }
            }
            return prevNodes;
        });
    };

    const unindentNode = (nodeId) => {
        setNodes((prevNodes) => {
            const node = prevNodes.find(node => node.id === nodeId);
            const parentNode = prevNodes.find(parent => parent.id === node.parentId);
            if (parentNode) {
                const newParentId = parentNode.parentId;
                const updatedNodes = prevNodes.map(node =>
                    node.id === nodeId ? { ...node, parentId: newParentId } : node
                );
                return updatedNodes;
            }
            return prevNodes;
        });
    };

    const moveNodeUp = (nodeId) => {
        historyManager.pushState([...nodes]);
        setNodes((prevNodes) => {
            const nodeIndex = prevNodes.findIndex(node => node.id === nodeId);
            if (nodeIndex > 0) {
                const node = prevNodes[nodeIndex];
                const siblings = prevNodes.filter(n => n.parentId === node.parentId);
                const siblingIndex = siblings.findIndex(n => n.id === nodeId);
                if (siblingIndex > 0) {
                    // Swap with the previous sibling
                    const newNodes = [...prevNodes];
                    const prevSiblingIndex = prevNodes.findIndex(n => n.id === siblings[siblingIndex - 1].id);
                    [newNodes[nodeIndex], newNodes[prevSiblingIndex]] = [newNodes[prevSiblingIndex], newNodes[nodeIndex]];
                    return newNodes;
                }
            }
            return prevNodes;
        });
    };

    const moveNodeDown = (nodeId) => {
        historyManager.pushState([...nodes]);
        setNodes((prevNodes) => {
            const nodeIndex = prevNodes.findIndex(node => node.id === nodeId);
            const node = prevNodes[nodeIndex];
            const siblings = prevNodes.filter(n => n.parentId === node.parentId);
            const siblingIndex = siblings.findIndex(n => n.id === nodeId);
            if (siblingIndex < siblings.length - 1) {
                // Swap with the next sibling
                const newNodes = [...prevNodes];
                const nextSiblingIndex = prevNodes.findIndex(n => n.id === siblings[siblingIndex + 1].id);
                [newNodes[nodeIndex], newNodes[nextSiblingIndex]] = [newNodes[nextSiblingIndex], newNodes[nodeIndex]];
                return newNodes;
            }
            return prevNodes;
        });
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

        return nodes.filter(node => node.id !== 'root'); // Ensure we don't include the pseudo-parent
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

    const undoAction = () => {
        const prevState = historyManager.undo();
        if (prevState !== null) {
            setNodes(prevState);
        }
    };

    const redoAction = () => {
        const nextState = historyManager.redo();
        if (nextState !== null) {
            setNodes(nextState);
        }
    };

    return (
        <TreeContext.Provider value={{
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
        }}>
            {children}
        </TreeContext.Provider>
    );
};
