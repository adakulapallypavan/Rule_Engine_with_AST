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

  const handleEvaluateRule = async () => {
    try {
      const data = {
        ruleId,
        data: userData,
      };
      const res = await API.post('/rules/evaluate', data);
      setResult(res.data.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
      setResult('Error occurred. Please check your inputs and rule.');
    }
  };
  return (
    <div>
      <h2>Evaluate Rule</h2>
      <input
        type="text"
        value={ruleId}
        onChange={(e) => setRuleId(e.target.value)}
        placeholder="Enter rule ID"
      />

      <h3>User Data</h3>
      <input
        type="text"
        value={userData.age}
        onChange={(e) => setUserData({ ...userData, age: e.target.value })}
        placeholder="Enter age"
      />
      <input
        type="text"
        value={userData.department}
        onChange={(e) => setUserData({ ...userData, department: e.target.value })}
        placeholder="Enter department"
      />
      <input
        type="text"
        value={userData.salary}
        onChange={(e) => setUserData({ ...userData, salary: e.target.value })}
        placeholder="Enter salary"
      />
      <input
        type="text"
        value={userData.experience}
        onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
        placeholder="Enter experience"
      />

      <button onClick={handleEvaluateRule}>Evaluate</button>

      {result !== null && (
        <div>
          <h3>Evaluation Result: {result ? 'Eligible' : 'Not Eligible'}</h3>
        </div>
      )}
    </div>
  );
};

export default EvaluateRule;
