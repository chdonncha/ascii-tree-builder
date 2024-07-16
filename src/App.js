import React from 'react';
import './App.scss';
import { TreeProvider } from './TreeContext';
import TreeInput from './components/TreeInput/TreeInput';
import TreeOutput from './components/TreeOutput/TreeOutput';
import Instructions from './components/Instructions/Instructions';

function App() {
  return (
    <div className="App">
      <TreeProvider>
        <h1>ASCII Tree Builder</h1>
        <Instructions />
        <TreeInput />
        <TreeOutput />
      </TreeProvider>
    </div>
  );
}

export default App;
