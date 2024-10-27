import React, { useState } from 'react';
import API from '../api';

const CreateRule = () => {
  const [ruleString, setRuleString] = useState('');
  const [response, setResponse] = useState(null);

  const handleCreateRule = async () => {
    try {
      const result = await API.post('/rules/create', { ruleString });
      setResponse(result.data);
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  return (
    <div className='container_style'>
      <h2>Create Rule</h2>
      <textarea
          value={ruleString}
          onChange={(e) => setRuleString(e.target.value)}
          onInput={(e) => {
            const target = e.target;
            target.style.height = 'auto'
            target.style.height = target.scrollHeight + 'px';
          }}
          placeholder="Enter rule string"
          className="rule_input"
          rows="3" 
      ></textarea>
      <button onClick={handleCreateRule} className='cool_button'>Create Rule</button>
      
      {response && (
        <div>
          <h3>Created Rule</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateRule;
