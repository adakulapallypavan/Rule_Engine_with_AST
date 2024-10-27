import React, { useState } from 'react';
import API from '../api';

const EvaluateRule = () => {
  const [ruleId, setRuleId] = useState('');
  const [userData, setUserData] = useState({
    age: '',
    department: '',
    salary: '',
    experience: '',
  });
  const [result, setResult] = useState(null);

  const getUserData = () => {
    const inputWrappers = document.getElementsByClassName('input_wrapper')
    const userData = {}
    for (let i = 0; i < inputWrappers.length; i++) {
      const key = inputWrappers[i].children[0].value
      const value = inputWrappers[i].children[1].value
      userData[key] = value 
    }
    return userData
  }

  const handleEvaluateRule = async () => {
    try {
      const data = {
        ruleId,
        data: getUserData(),
      };
      console.log('evaluating the data:', data);
      if(!ruleId) {
        setResult('Please enter rule ID');
        return;
      }
      const res = await API.post('/rules/evaluate', data);
      if(res.data.error) {
        throw new Error(res.data.error)
      }
      res.data.result ? setResult('Eligible') : setResult('Not Eligible');
    } catch (error) {
      console.error('Error evaluating rule:', error);
      setResult('Error occurred. Please check your inputs and rule.');
    }
  };

  const handleAddInputField = () => {
    const inputContainer = document.getElementById('input_container')
    const inputWrapper = document.createElement('div')
    inputWrapper.className = 'input_wrapper'

    const keyInput = document.createElement('input')
    keyInput.placeholder = 'Enter key'
    keyInput.id = 'key'
    inputWrapper.appendChild(keyInput)

    const valueInput = document.createElement('input')
    valueInput.placeholder = 'Enter value'
    valueInput.id = 'value'
    inputWrapper.appendChild(valueInput)
    
    inputContainer.prepend(inputWrapper)
  }

  return (
    <div id="evaluate_input" className='container_style'>
      <h2>Evaluate Rule</h2>
      <input
        type="text"
        value={ruleId}
        onChange={(e) => setRuleId(e.target.value)}
        placeholder="Enter rule ID"
      />

      <h3>User Data</h3>

      <div id="input_container">
        <div className="input_wrapper">
          <input id="key" placeholder="Enter key" />
          <input id="value" placeholder="Enter value" />
        </div></div>
      <button onClick={handleAddInputField} className='cool_button'>Add Field</button>

      <button onClick={handleEvaluateRule} className='cool_button'>Evaluate</button>

      {result !== null && (
        <div>
          <h3>Evaluation Result: {result}</h3>
        </div>
      )}
    </div>
  );
};

export default EvaluateRule;
