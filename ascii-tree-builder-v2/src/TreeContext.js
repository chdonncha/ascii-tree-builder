import React, { createContext, useContext, useState } from 'react';

const TreeContext = createContext();

export const useTree = () => useContext(TreeContext);

const findNodeById = (nodes, id) => nodes.find(node => node.id === id);

const deleteNodeAndChildren = (nodes, nodeId) => {
    const withoutNode = nodes.filter(node => node.id !== nodeId);
    const childrenOfNode = nodes.filter(node => node.parentId === nodeId);
    let result = withoutNode;
    childrenOfNode.forEach(child => {
        result = deleteNodeAndChildren(result, child.id);
    });
    return result;
};

export const TreeProvider = ({ children }) => {
    const [nodes, setNodes] = useState([{ id: 'root', parentId: null, name: 'Root' }]);

    const addNode = (parentId, name) => {
        const newNode = {
            id: `${Math.random()}`, // Simple unique id generator for demonstration
            parentId,
            name,
        };
        setNodes(currentNodes => [...currentNodes, newNode]);
    };

    const deleteNode = (nodeId) => {
        setNodes(currentNodes => deleteNodeAndChildren(currentNodes, nodeId));
    };

    const renameNode = (nodeId, newName) => {
        setNodes(currentNodes => currentNodes.map(node => node.id === nodeId ? { ...node, name: newName } : node));
    };

    return (
        <TreeContext.Provider value={{ nodes, addNode, deleteNode, renameNode }}>
            {children}
        </TreeContext.Provider>
    );
};
