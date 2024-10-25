import mongoose from 'mongoose';

// Define the AST Node schema
const nodeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // 'operator' or 'operand'
    enum: ['operator', 'operand'], // Define allowed types
  },
  left: {
    type: mongoose.Schema.Types.Mixed, // Reference to another node or null
    default: null,
  },
  right: {
    type: mongoose.Schema.Types.Mixed, // Reference to another node or null
    default: null,
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // The value for 'operand' nodes (could be number, string, etc.)
    required: function () {
      return this.type === 'operand'; // Required only for operand nodes
    },
  },
  operator: {
    type: String,
    enum: ['AND', 'OR', '>', '<', '=', '>=', '<='], // Define allowed operators for 'operator' type nodes
    required: function () {
      return this.type === 'operator'; // Required only for operator nodes
    },
  },
});

// Define the Rule schema which will be an AST
const ruleSchema = new mongoose.Schema({
  ruleString: {
    type: String,
    required: true, // The rule in string format
  },
  ast: {
    type: nodeSchema, // The AST root node
    required: true,
  },
});

const Rule = mongoose.model('Rule', ruleSchema);
export default Rule;
