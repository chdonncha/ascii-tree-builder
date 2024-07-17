import React from 'react';

import './App.scss';
import { Instructions } from './components/Instructions/Instructions';
import { TreeInput } from './components/TreeInput/TreeInput';
import { TreeOutput } from './components/TreeOutput/TreeOutput';
import { TreeProvider } from './TreeContext';

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

export { App };
