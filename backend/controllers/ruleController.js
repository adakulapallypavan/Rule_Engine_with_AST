import Rule from '../models/Rule.js';

// Helper function to create AST from rule string
const createASTFromRule = (ruleString) => {
  const operators = ['AND', 'OR'];
  let stack = [];
  let current = {};

  const tokens = ruleString.split(/\s+/);

  tokens.forEach(token => {
    if (operators.includes(token)) {
      let right = stack.pop();
      let left = stack.pop();
      stack.push({ type: 'operator', value: token, left, right });
    } else if (token.includes('>') || token.includes('<') || token.includes('=')) {
      stack.push({ type: 'operand', value: token });
    }
  });

  return stack[0]; // Return the root of AST
};

// Create Rule (API)
export const createRule = async (req, res) => {
  const { ruleString } = req.body;
  try {
    const ast = createASTFromRule(ruleString); // Convert rule string into AST
    const newRule = new Rule({ ruleString, ast });
    await newRule.save();
    res.status(201).json(newRule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create rule', details: err.message });
  }
};

// Helper function to combine two ASTs using a logical operator
const combineASTs = (ast1, ast2, operator) => {
  return {
    type: 'operator',
    value: operator,
    left: ast1,
    right: ast2,
  };
};

// Combine Rules (API)
export const combineRules = async (req, res) => {
  const { rules, operator } = req.body; // rules is an array of rule strings, operator could be 'AND' or 'OR'
  try {
    let combinedAST = null;

    for (const ruleString of rules) {
      const ast = createASTFromRule(ruleString);
      combinedAST = combinedAST ? combineASTs(combinedAST, ast, operator) : ast;
    }

    res.status(200).json(combinedAST);
  } catch (err) {
    res.status(500).json({ error: 'Failed to combine rules', details: err.message });
  }
};

// Helper function to evaluate AST against user data
const evaluateAST = (node, data) => {
  console.log('Evaluating node:', node);
  console.log('Data:', data);

  if (node.type === 'operand') {
    const [attribute, operator, value] = node.value.split(' ');
    const userValue = data[attribute];
    console.log(`Operand evaluation: ${attribute} ${operator} ${value}, User value: ${userValue}`);

    switch (operator) {
      case '>': return Number(userValue) > Number(value); // Make sure comparison is numeric
      case '<': return Number(userValue) < Number(value); // Make sure comparison is numeric
      case '=': return userValue === value.replace(/['"]+/g, ''); // Removing quotes for strings
      default: return false;
    }
  } else if (node.type === 'operator') {
    const leftResult = evaluateAST(node.left, data);
    const rightResult = evaluateAST(node.right, data);
    console.log(`Operator evaluation: ${node.value}, Left result: ${leftResult}, Right result: ${rightResult}`);

    if (node.value === 'AND') return leftResult && rightResult;
    if (node.value === 'OR') return leftResult || rightResult;
  }
};


// Evaluate Rule (API)
export const evaluateRule = async (req, res) => {
  const { ruleId, data } = req.body;
  try {
    const rule = await Rule.findById(ruleId);
    if (!rule) return res.status(404).json({ error: 'Rule not found' });

    const result = evaluateAST(rule.ast, data);

    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate rule', details: err.message });
  }
};

