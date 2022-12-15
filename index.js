// A simple, iterator-based, recursive descent parser: 
// https://en.wikipedia.org/wiki/Recursive_descent_parser

const PUNCTUATORS = {
  open: '(',
  close: ')',
};

const PUNCTUATOR_REGEXES = {
  open: new RegExp('(\\' + PUNCTUATORS.open + ')', 'g'),
  close: new RegExp('(\\' + PUNCTUATORS.close + ')', 'g'),
};

const ProgramEnv = {
  add(...args) {
    return args.reduce((a, b) => Number(a) + Number(b), 0);
  },

  sub(...args) {
    return args.reduce((a, b) => Number(a) - Number(b));
  }
};

/**
 * Tokenizes a string such as `(add 2 (add 5 5))`.
 * @returns {Array}
 */
function tokenize(str = '') {
  const { open, close } = PUNCTUATOR_REGEXES;

  return str.replace(open, ' $1 ')
    .replace(close, ' $1 ')
    .trim()
    .split(/\s+/);
}

/**
 * Builds an AST such as: `['add', 2, ['add', 5, 5]]`
 * @returns {Array}
 */
function parse(tokens = []) {
  let token = tokens.shift();

  // Entering an expression
  if (token === PUNCTUATORS.open) {
    const exp = [];

    // Build expression recursively
    while (tokens[0] !== PUNCTUATORS.close) {
      exp.push(parse(tokens));
    }

    tokens.shift(); // remove closing punctuator

    return exp;
  }

  return token;
}

/**
 * Evaluates AST of expressions.
 * @returns {Number}
 */
function evaluate(exp = []) {
  const procedure = exp[0];
  const args = [];

  for (const arg of exp.slice(1)) {
    if (Array.isArray(arg)) {
      args.push(evaluate(arg));
    } else {
      args.push(arg);
    }
  }

  return ProgramEnv[procedure].apply(null, args);
}

// Tests
[
  evaluate(parse(tokenize('(add 2 (add 5 5) 3)'))) === 15,
  evaluate(parse(tokenize('(add 2 (add 5 5) 3 (add 10 5))'))) === 30,
  evaluate(parse(tokenize('(add 2 (add 5 5) (add 3 3) (add 10 5))'))) === 33,
  evaluate(parse(tokenize('(sub 20 (add 10 5))'))) === 5,
  evaluate(parse(tokenize('(sub 20 (add 10 5) 3)'))) === 2,
  evaluate(parse(tokenize('(sub 100 (add 10 20) 5 (add 10 5))'))) === 50,
  evaluate(parse(tokenize('(sub 100 (add 10 20) (sub 40 20) (add 10 5) 5)'))) === 30
].forEach(console.assert);
