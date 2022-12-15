# About
You can ignore. For learning purposes. 
Exploring implementation of a barebones Lisp-like "interpreter" with JavaScript.

### Tokenization
```javascript
const program = '(add 2 (add 5 5) 3)';
const tokens = tokenize(program);

console.log(tokens);
//=> ['(', 'add', '2', '(', 'add', '5', '5', ')', '3', ')']
```

### Abstract Syntax Tree
```javascript
const program = '(add 2 (add 5 5) 3)';
const AST = parse(tokenize(program));

console.log(AST);
//=> ['add', '2', ['add', '5', '5'], '3']
```

### Evaluation
```javascript
[
  evaluate(parse(tokenize('(add 2 (add 5 5) 3)'))) === 15,
  evaluate(parse(tokenize('(add 2 (add 5 5) 3 (add 10 5))'))) === 30,
  evaluate(parse(tokenize('(add 2 (add 5 5) (add 3 3) (add 10 5))'))) === 33,
  evaluate(parse(tokenize('(sub 20 (add 10 5))'))) === 5,
  evaluate(parse(tokenize('(sub 20 (add 10 5) 3)'))) === 2,
  evaluate(parse(tokenize('(sub 100 (add 10 20) 5 (add 10 5))'))) === 50,
  evaluate(parse(tokenize('(sub 100 (add 10 20) (sub 40 20) (add 10 5) 5)'))) === 30
].forEach(console.assert);
```
