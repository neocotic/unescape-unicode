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

/**
 * A map of parsers for valid characters found within the hexadecimal segment of a Unicode escape.
 *
 * This map is used for hash lookup performance.
 *
 * @type {Object.<string, Function>}
 */
const parsers = {};

/**
 * Parses the specified hexadecimal character found within the input string at the given <code>index</code> and
 * recalclates the <code>unicode</code> code point (hexadecimal value) provided.
 *
 * An error will be thrown if <code>ch</code> is not valid within a Unicode escape.
 *
 * @param {string} ch - the character to be parsed to recalculate the <code>unicode</code> code point
 * @param {number} unicode - the current Unicode code point
 * @param {number} index - the index of <code>ch</code> within the input string
 * @return {number} The recalculated Unicode code point (hexadecimal value).
 * @throws {Error} If <code>ch</code> is not a valid hexadecimal character.
 */
function parse(ch, unicode, index) {
  const parser = parsers[ch];
  if (parser) {
    return parser(ch.charCodeAt(0), unicode);
  }

  throw new Error(errors.unexpectedCharacter(ch, index));
}

/**
 * Maps the specified <code>parser</code> function to each of the characters provided.
 *
 * @param {string} chars - a string containing the characters to be mapped to <code>parser</code>
 * @param {Function} parser - the parser function to calculate the Unicode value for each of the characters
 * @return {void}
 */
function register(chars, parser) {
  chars.split('').forEach((ch) => {
    parsers[ch] = parser;
  });
}

register('0123456789', (code, unicode) => (unicode << 4) + code - 0x30);
register('ABCDEF', (code, unicode) => (unicode << 4) + 10 + code - 0x41);
register('abcdef', (code, unicode) => (unicode << 4) + 10 + code - 0x61);

module.exports = parse;
