import React, { useState } from 'react';
import API from '../api';

const CombineRules = () => {
  const [ruleStrings, setRuleStrings] = useState(['']);
  const [response, setResponse] = useState(null);

  const handleAddRule = () => {
    setRuleStrings([...ruleStrings, '']);
  };

  const handleCombineRules = async () => {
    try {
      const result = await API.post('/rules/combine', { rules: ruleStrings });
      setResponse(result.data);
    } catch (error) {
      console.error('Error combining rules:', error);
    }
  };

  return (
    <div className='container_style'>
      <h2>Combine Rules</h2>
      {ruleStrings.map((rule, index) => (
        <input
          key={index}
          type="text"
          value={rule}
          onChange={(e) => {
            const updatedRules = [...ruleStrings];
            updatedRules[index] = e.target.value;
            setRuleStrings(updatedRules);
          }}
          placeholder="Enter rule string"
        />
      ))}
      <button onClick={handleAddRule} className='cool_button'>Add Another Rule</button>
      <button onClick={handleCombineRules} className='cool_button'>Combine Rules</button>

      {response && (
        <div>
          <h3>Combined Rule AST</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CombineRules;
