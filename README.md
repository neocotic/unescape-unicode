# unescape-unicode

[![Build Status](https://img.shields.io/travis/neocotic/unescape-unicode/develop.svg?style=flat-square)](https://travis-ci.org/neocotic/unescape-unicode)
[![Coverage](https://img.shields.io/codecov/c/github/neocotic/unescape-unicode/develop.svg?style=flat-square)](https://codecov.io/gh/neocotic/unescape-unicode)
[![Dev Dependency Status](https://img.shields.io/david/dev/neocotic/unescape-unicode.svg?style=flat-square)](https://david-dm.org/neocotic/unescape-unicode?type=dev)
[![License](https://img.shields.io/npm/l/unescape-unicode.svg?style=flat-square)](https://github.com/neocotic/unescape-unicode/blob/master/LICENSE.md)
[![Release](https://img.shields.io/npm/v/unescape-unicode.svg?style=flat-square)](https://www.npmjs.com/package/unescape-unicode)

[unescape-unicode](https://github.com/neocotic/unescape-unicode) is a [Node.js](https://nodejs.org) library that can
convert a Unicode escape ("\uxxxx" notation) into its corresponding Unicode character.

* [Install](#install)
* [API](#api)
* [Bugs](#bugs)
* [Contributors](#contributors)
* [License](#license)

## Install

Install using `npm`:

``` bash
$ npm install --save unescape-unicode
```

You'll need to have at least [Node.js](https://nodejs.org) 8 or newer.

## API

### `unescapeUnicode(input[, start])`

Converts the Unicode escape within `input`.

The Unicode escape *must* be valid, although it can just contain hexadecimal segment. That is, it has to match the
following pattern:

    (\\u)?[0-9A-Fa-f]{4}

An error will be thrown if no valid Unicode escape is found.

Optionally, a `start` index can be provided to begin conversion at a specific location within `input`. If `start` is not
specified, `null`, or negative, the conversion will begin at the start of `input`.

#### Examples

``` javascript
const unescapeUnicode = require('unescape-unicode');

unescapeUnicode('\\u2665');
//=> "♥"
unescapeUnicode('2665');
//=> "♥"
unescapeUnicode('I \\u2665 Unicode!', 2);
//=> "♥"
unescapeUnicode('\\u03bb');
//=> "λ"
unescapeUnicode('03BB');
//=> "λ"
```

## Bugs

If you have any problems with this library or would like to see changes currently in development you can do so
[here](https://github.com/neocotic/unescape-unicode/issues).

## Contributors

If you want to contribute, you're a legend! Information on how you can do so can be found in
[CONTRIBUTING.md](https://github.com/neocotic/unescape-unicode/blob/master/CONTRIBUTING.md). We want your suggestions
and pull requests!

A list of contributors can be found in
[AUTHORS.md](https://github.com/neocotic/unescape-unicode/blob/master/AUTHORS.md).

## License

Copyright © 2018 Alasdair Mercer

See [LICENSE.md](https://github.com/neocotic/unescape-unicode/raw/master/LICENSE.md) for more information on our MIT
license.
