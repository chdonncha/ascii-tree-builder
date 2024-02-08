import React from 'react';
import { TreeProvider } from './TreeContext';
import TreeInput from './components/TreeInput';
import TreeOutput from './components/TreeOutput';

function App() {
    return (
        <TreeProvider>
            <div className="App">
                <h1>ASCII Tree Builder</h1>
                <TreeInput />
                <TreeOutput />
                {/* Implement and include NodeManipulationPanel here */}
            </div>
        </TreeProvider>
    );
}

export default App;
