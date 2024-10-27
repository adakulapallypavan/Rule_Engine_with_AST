import React from 'react';
import CreateRule from './components/CreateRule';
import CombineRules from './components/CombineRules';
import EvaluateRule from './components/EvaluateRule';
import './App.css';

const App = () => {
  return (
    <div className='main-app'>
      <h1>Rule Engine with AST</h1>
      <div id="main_features">
        <CreateRule />
        <CombineRules />
        <EvaluateRule />
      </div>
    </div>
  );
};

export default App;
