import Rule from '../models/Rule.js';

// Helper function to create AST from rule string

const createASTFromRule  = (ruleString) => {
  let tokens = ruleString.match(/(\(|\)|\w+|'.+?'|>=|<=|>|<|=|AND|OR)/g);
  let current, past
  let exp = false
  let curStack = []
  let open = 0
  
  try {
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i]
      if(token === ">" || token === "<" || token === "=") {
        curStack.push({type: "operator",  operator: token, left: past})
        exp = true
      } else if(token === "AND" || token === "OR") {
        curStack.push({type: "operator",  operator: token, left: curStack.pop()})
      } else if(token === "(") {
        open++;
      } else if(token === ')') {
        open--;
        let current = curStack.pop()
        if(curStack.length>0 && !curStack[curStack.length-1].right) {
          curStack[curStack.length-1].right = current
          current = curStack.pop()
          if(open === 0 && curStack.length>0 && !curStack[curStack.length-1].right) {
            curStack[curStack.length-1].right = current
          } else {
            curStack.push(current)
          }
        }
      } else {
        let node = {type: "operand", value: token}
        if(exp) {
          current = curStack.pop()
          current.right = node
          exp = false
          if(open === 0) {
            if(curStack.length>0 && !curStack[curStack.length-1].right) {
              curStack[curStack.length-1].right = current
            } else {
              curStack.push(current)
            }
          } else {
            curStack.push(current)
          }
        } else {
          past = node
        }
      }
    }
  } catch (err) {
    throw new Error("Invalid Rule", err)
  }
  if(curStack.length !== 1) {
    throw new Error("Invalid Rule")
  }
  return curStack[0]
}

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
    operator,
    left: ast1,
    right: ast2,
  };
};

// Combine Rules (API)
export const combineRules = async (req, res) => {
  const { rules, operator = 'AND' } = req.body; // rules is an array of rule strings, operator could be 'AND' or 'OR'
  try {
    let combinedAST = null;

    for (const ruleString of rules) {
      const ast = createASTFromRule(ruleString);
      combinedAST = combinedAST ? combineASTs(combinedAST, ast, operator) : ast;
    }
    const newRule = new Rule({ ruleString: rules.join(' AND '), ast: combinedAST });
    await newRule.save();
    res.status(201).json(newRule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to combine rules', details: err.message });
  }
};

// Helper function to evaluate AST against user data
const evaluateAST = (node, data) => {

  if(node.type === "operator") {
    const operator = node.operator
    if(operator === 'AND' || operator === 'OR') {
      let left = evaluateAST(node.left, data)
      let right = evaluateAST(node.right, data)
      if(operator === 'AND') {
        return left && right
      } else {
        return left || right
      }
    } else {
      const attribute = node.left.value, value = node.right.value
      const userValue = data[attribute]

      if(userValue === undefined) {
        return true
      }
      switch (operator) {
        case '>': return Number(userValue) > Number(value);
        case '<': return Number(userValue) < Number(value); 
        case '=': return userValue === value.replace(/['"]+/g, '');
        default: return true;
      }
    }
  }
  return true
}


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

