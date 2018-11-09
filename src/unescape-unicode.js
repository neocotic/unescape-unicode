/*
 * Copyright (C) 2018 Alasdair Mercer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

const errors = require('./errors');
const parse = require('./parse');

/**
 * Returns the offset to be added on top of the specified <code>start</code> index relative to <code>input</code>.
 *
 * The offset is calculated based on whether <code>input<code> begins with "\u".
 *
 * An error will be thrown if the initial character is a backslash but it is not followed by a lower case "u", as this
 * is not a valid Unicode escape.
 *
 * @param {string} input - the string containing the Unicode escape to which the offset is to be applied
 * @param {number} start - the index of the Unicode escape within <code>input</code> to which the offset is to be
 * applied (inclusive)
 * @return {number} The additional offset to be applied to <code>start</code>.
 * @throws {Error} If <code>input</code> doesn't contain a valid Unicode escape at <code>start</code>.
 */
function getOffset(input, start) {
  let ch = input[start];

  if (ch === '\\') {
    ch = input[start + 1];
    if (ch !== 'u') {
      throw new Error(errors.unexpectedCharacter(ch, start + 1));
    }

    return 2;
  }

  return 0;
}

/**
 * Converts the Unicode escape within <code>input</code>.
 *
 * The Unicode escape <i>must</i> be valid, although it can just contain hexadecimal segment. That is, it has to match
 * the following pattern:
 *
 * <pre>
 * (\\u)?[0-9A-Fa-f]{4}
 * </pre>
 *
 * An error will be thrown if no valid Unicode escape is found.
 *
 * Optionally, a <code>start</code> index can be provided to begin conversion at a specific location within
 * <code>input</code>. If <code>start</code> is not specified, <code>null</code>, or negative, the conversion will begin
 * at the start of <code>input</code>.
 *
 * @example
 * unescapeUnicode('\\u2665');
 * //=> "♥"
 * unescapeUnicode('2665');
 * //=> "♥"
 * unescapeUnicode('I \\u2665 Unicode!', 2);
 * //=> "♥"
 * @param {?string} input - the string containing the Unicode escape to be converted (may be <code>null</code>)
 * @param {number} [start=0] - the index of the Unicode escape to be converted within <code>input</code> (inclusive -
 * may be <code>null</code>)
 * @return {?string} The Unicode character converted from the escape within <code>input</code> or <code>null</code> if
 * <code>input</code> is <code>null</code>.
 * @throws {Error} If <code>input</code> doesn't contain a valid Unicode escape at <code>start</code>.
 */
function unescapeUnicode(input, start) {
  if (input == null) {
    return input;
  }
  if (start == null || start < 0) {
    start = 0;
  }

  start += getOffset(input, start);

  const end = Math.min(start, input.length) + 4;
  if (end > input.length) {
    throw new Error(errors.insufficientCharacters(input.length - end));
  }

  let unicode = 0;
  for (let i = start; i < end; i++) {
    unicode = parse(input[i], unicode, i);
  }

  return String.fromCharCode(unicode);
}

module.exports = unescapeUnicode;
