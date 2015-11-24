# RegExTag

[![NPM][npm-badge]][npm-link]

This is a tag for template literals that allows you create regular expressions more easily.

## Requirements

As template literals are a part of ES6, you need an engine that supports ES6.

## Usage

In the nutshell:

```javascript
let RegExTag = require('regextag');

let myRegexp = RegExTag({ignoreCase: true, verbose: true})`
    ^    # Start of the line
    .*   # Match every char
    ${n} # Then contents of the n variable
    $    # End of the line
`;

myRegexp; //  /^.*42$/i

```

The overall usage is: ``` RegExTag ( ``` options ``` ) ` ``` template ``` ` ```

## Options

Options is an object with the following boolean fileds.

### [`global`][mdn-global], [`ignoreCase`][mdn-ignorecase], [`multiline`][mdn-multiline]

Works just as usual regexp modifiers.

```javascript

RegExTag ({global: true, ignoreCase: true, multiline: true}) `foobar`; // /foobar/gim

```

Note that `ignoreCase` name is, unfortunately, case dependent.

### [`sticky`][mdn-sticky]

An experimental regexp modifier. May be unsupported by your engine.

```javascript

RegExTag ({sticky: true}) `foobar`; // If you're lucky enough, then /foobar/y

```

### [`unicode`][mdn-unicode]

An experimental regexp modifier. May be unsupported by your engine.

```javascript

RegExTag ({unicode: true}) `foobar`; // If you're lucky enough, then /foobar/u

```

### `verbose`

Not a regexp modifier but rather a parser option. Ignores all the whitespaces in the template and adds comments starting from `#`.

```javascript

RegExTag ({verbose: true}) `
    Hello world! # That's what every coder writes at least once :)
`; // /Helloworld!/

```

### `dotAll`

An another parser option. If provided, dot (`.`) is replaced by `[^]` that matches everything.

Dot is not replaced if escaped and in character classes and template substitutions.

```javascript

RegExTag ({dotAll: true}) `.*[.,]\.`; // /[^]*[.,]\./

```

## Template

Just like plain old regular expressions. There's no need to escape backslashes twice, `` `\s` `` produces `/\s/`.

```javascript

RegExTag () `Foo\s*bar`; // /foo\s*bar/

```

You can use template literal substitutions and it would be escaped for you.

```javascript

let variable = '.*';

RegExTag () `^foo${variable}bar`; // /foo\.\*bar/

```

[npm-badge]: https://nodei.co/npm/regextag.png?downloads=true&downloadRank=true&stars=true "npm install regextag"
[npm-link]: https://www.npmjs.com/package/regextag

[mdn-global]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global
[mdn-ignorecase]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase
[mdn-multiline]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/multiline
[mdn-sticky]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky
[mdn-unicode]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode
