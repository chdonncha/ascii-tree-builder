import React from 'react';
import { useTree } from '../TreeContext';
const TreeOutput = () => {
    const { tree } = useTree();

    return <pre>Tree ASCII Representation Here</pre>;
};

export default TreeOutput;
