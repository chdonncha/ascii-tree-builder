import React, { createContext, useContext, useState } from 'react';
import { SAMPLE_TREE_DATA } from './utils/sampleTreeData';
import { v4 as uuidv4 } from 'uuid';

const TreeContext = createContext();

export const useTree = () => useContext(TreeContext);

export const TreeProvider = ({ children }) => {
    const [nodes, setNodes] = useState(SAMPLE_TREE_DATA); // Initialize with SAMPLE_TREE_DATA
    const [selectedNodeId, setSelectedNodeId] = useState(null);

    const addNode = (parentId, name) => {
        const newNode = {
            id: uuidv4(),
            parentId,
            name,
            type: null,
        };
        setNodes((prevNodes) => [...prevNodes, newNode]);
    };

    const deleteNode = (nodeId) => {
        const getAllDescendants = (nodeId, nodes) => {
            const directChildren = nodes.filter(node => node.parentId === nodeId);
            return directChildren.reduce((acc, child) => {
                return [...acc, child.id, ...getAllDescendants(child.id, nodes)];
            }, []);
        };

        const nodeIdsToDelete = getAllDescendants(nodeId, nodes);
        nodeIdsToDelete.push(nodeId);

        setNodes((prevNodes) => prevNodes.filter(node => !nodeIdsToDelete.includes(node.id)));
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


// Add indentNode and unindentNode to the value provided by TreeContext.Provider


    return (
        <TreeContext.Provider value={{
            nodes,
            addNode,
            selectNode,
            selectedNodeId,
            updateNodeType, // Add this line to make the function available in the context
            indentNode,
            unindentNode,
            deleteNode,
        }}>
            {children}
        </TreeContext.Provider>
    );
};
