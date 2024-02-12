import React from 'react';
import './App.scss';
import {TreeProvider} from './TreeContext';
import TreeInput from './components/TreeInput';
import TreeOutput from './components/TreeOutput';

function App() {
    return (
        <div className="App">
            <TreeProvider>
                <h1>ASCII Tree Builder</h1>
                <TreeInput/>
                <TreeOutput/>
                {/* Implement and include NodeManipulationPanel here */}
            </TreeProvider>
        </div>
    );
}

export default App;
