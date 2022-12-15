// A simple, iterator-based, recursive descent parser: 
// https://en.wikipedia.org/wiki/Recursive_descent_parser

// Token splitter with two groups:
// 1. Non-capture mode: newlines, spaces, tabs
// 2. Capture mode: '(' and ')'
const SPLITTER = /(?:[\n\s\t]+)|(\(|\))/;
const isNumber = /\d/;

/**
 * Tokenizes a string like `(add 5 (add 3 2), 5.5)` into token objects:
 * [
 *   { kind: '(', value: '(' },
 *   { kind: 'add', value: 'add' },
 *   { kind: 'number', value: '5' },
 *   ...
 * ]
 */
function tokenize(source) {
  const parts = source.split(SPLITTER).filter(part => !!part);
  const tokens = [];

  for (let part of parts) {
    let kind = part;

    if (isNumber.test(part)) {
      kind = 'number';
    }

    tokens.push({kind, value: part});
  }

  return tokens;
}


/**
 * A simple iterator parser. Parses tokens into an array AST:
 * ['add', 5, ['add', 3, 2], 5.5]
 */
const PUNCTUATORS = {open: '(', close: ')'};
class ParserContext {
  constructor(tokens) {
    this.index = 0;
    this.tokens = tokens;
    this.length = tokens.length;
  }

  current() {
    return this.tokens[this.index];
  }

  peek(kind) {
    return this.current().kind === kind;
  }

  next() {
    const token = this.current();
    if (this.index + 1 < this.length) this.index++;
    return token;
  }
}

function parse(context) {
  let token = context.next();

  if (token.kind === PUNCTUATORS.open) {
    const out = [];

    while (!context.peek(PUNCTUATORS.close)) {
      out.push(parse(context));
    }

    context.next(); // ignore ')'

    return out;
  }

  if (token.kind === 'number') {
    return Number(token.value);
  } else {
    return token.value;
  }
}


/**
 * Evaluates AST of expressions.
 */
const ProgramEnv = {
  add: (...args) => args.reduce((a, b) => a + b)
};

function evaluate(expression) {
  const args = [];
  const procedure = expression[0];

  for (let arg of expression.slice(1)) {
    if (Array.isArray(arg)) {
      args.push(evaluate(arg));
    } else {
      args.push(arg);
    }
  }

  return ProgramEnv[procedure].apply(null, args);
}


// -----------------------------------------------
// Example program
// -----------------------------------------------
const tokens = tokenize(`
  ( add 5

    (add
      (add 2 1)
      7
    )

    (add 3  2 )

    5.5

  )
`);
const exp = parse(new ParserContext(tokens));
evaluate(exp); //=> 25.5

[ // Tests
  evaluate(parse(new ParserContext(tokenize('(add 2 (add 5 5) 3)')))) === 15,
  evaluate(parse(new ParserContext(tokenize('(add 2 (add 5 5) 3 (add 10 5))')))) === 30,
  evaluate(parse(new ParserContext(tokenize('(add 2 (add 5 5) (add 3 3) (add 10 (add 3 2)))')))) === 33,
].forEach(console.assert);
