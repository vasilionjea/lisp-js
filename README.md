# lisp-js
Exploring implementation of a barebones Lisp-like interpreter with JavaScript.

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
