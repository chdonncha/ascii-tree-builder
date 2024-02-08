// TreeContext.js
import React, { createContext, useContext, useState } from 'react';

const TreeContext = createContext();

export const useTree = () => useContext(TreeContext);

export const TreeProvider = ({ children }) => {
    const [nodes, setNodes] = useState([{ id: 'root', parentId: null, name: 'Root' }]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);

    const addNode = (parentId, name) => {
        const newNode = {
            id: `${new Date().getTime()}`, // Generate Unique ID
            parentId,
            name,
        };
        setNodes((prevNodes) => [...prevNodes, newNode]);
    };

    const selectNode = (nodeId) => {
        setSelectedNodeId(nodeId);
    };

    const indentNode = (nodeId) => {
        setNodes((prevNodes) => {
            const nodeIndex = prevNodes.findIndex(node => node.id === nodeId);
            if (nodeIndex > 0) { // Ensure there is a previous sibling to become the parent
                const newParentId = prevNodes[nodeIndex - 1].id;
                return prevNodes.map(node => node.id === nodeId ? { ...node, parentId: newParentId } : node);
            }
            return prevNodes;
        });
    };

    const unindentNode = (nodeId) => {
        setNodes((prevNodes) => {
            const node = prevNodes.find(node => node.id === nodeId);
            const parentNode = prevNodes.find(parent => parent.id === node.parentId);
            if (parentNode) { // Ensure there is a parent to unindent
                // Move node to the same level as its current parent, making its "grandparent" its new parent
                const newParentId = parentNode.parentId;
                return prevNodes.map(node => node.id === nodeId ? { ...node, parentId: newParentId } : node);
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
            indentNode, // Include indentNode in the context value
            unindentNode // Include unindentNode in the context value
        }}>
            {children}
        </TreeContext.Provider>
    );
};
