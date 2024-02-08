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

    return (
        <TreeContext.Provider value={{ nodes, addNode, selectNode, selectedNodeId }}>
            {children}
        </TreeContext.Provider>
    );
};
