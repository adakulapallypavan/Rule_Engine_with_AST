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
    <div>
      <h2>Create Rule</h2>
      <input
        type="text"
        value={ruleString}
        onChange={(e) => setRuleString(e.target.value)}
        placeholder="Enter rule string"
      />
      <button onClick={handleCreateRule}>Create Rule</button>
      
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
