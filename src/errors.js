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

/**
 * Contains functions for generating error messages used throughout <code>unescape-unicode</code>.
 *
 * @type {Object.<string, Function>}
 */
const errors = {

  /**
   * Returns the error message to be used when insufficient characters were found within the input string to represent a
   * valid Unicode escape.
   *
   * @param {number} missing - the number of characters missing (negative)
   * @return {string} The error message.
   */
  insufficientCharacters(missing) {
    return `Insufficient characters found: ${missing}`;
  },

  /**
   * Returns the error message to be used when an unexpected character is found within the Unicode escape.
   *
   * @param {string} ch - the unexpected character that was found
   * @param {number} index - the index at which <code>ch</code> was found relative to the input string
   * @return {string} The error message.
   */
  unexpectedCharacter(ch, index) {
    return `Unexpected character "${ch}" found at ${index}`;
  }

};

module.exports = errors;
