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

const assert = require('assert');

const unescapeUnicode = require('../src/unescape-unicode');

describe('unescapeUnicode', () => {
  const tests = {
    '003c': '<',
    '003d': '=',
    '003e': '>',
    '0075': 'u',
    '0074': 't',
    '0066': 'f',
    '0038': '8',
    '24e4': 'ⓤ',
    '24e3': 'ⓣ',
    '24d5': 'ⓕ',
    '2467': '⑧'
  };

  it('should convert Unicode escape', () => {
    for (const [ input, expected ] of Object.entries(tests)) {
      const actual = unescapeUnicode(input);

      assert.equal(actual, expected);
    }
  });

  it('should ignore case of Unicode values', () => {
    for (const [ input, expected ] of Object.entries(tests)) {
      const actual = unescapeUnicode(input.toUpperCase());

      assert.equal(actual, expected);
    }
  });

  context('when input is null', () => {
    it('should return null', () => {
      const actual = unescapeUnicode(null);

      assert.strictEqual(actual, null);
    });
  });

  context('when input is empty', () => {
    it('should throw an error', () => {
      assert.throws(() => {
        unescapeUnicode('');
      }, (error) => {
        return error instanceof Error && error.message === 'Insufficient characters found: -4';
      });
    });
  });

  context('when input is too short', () => {
    it('should throw an error', () => {
      assert.throws(() => {
        unescapeUnicode('0');
      }, (error) => {
        return error instanceof Error && error.message === 'Insufficient characters found: -3';
      });

      assert.throws(() => {
        unescapeUnicode('00');
      }, (error) => {
        return error instanceof Error && error.message === 'Insufficient characters found: -2';
      });

      assert.throws(() => {
        unescapeUnicode('003');
      }, (error) => {
        return error instanceof Error && error.message === 'Insufficient characters found: -1';
      });
    });
  });

  context('when input contains invalid Unicode values', () => {
    it('should throw an error', () => {
      assert.throws(() => {
        unescapeUnicode('003g');
      }, (error) => {
        return error instanceof Error && error.message === 'Unexpected character "g" found at 3';
      });

      assert.throws(() => {
        unescapeUnicode('00zc');
      }, (error) => {
        return error instanceof Error && error.message === 'Unexpected character "z" found at 2';
      });

      assert.throws(() => {
        unescapeUnicode('0!3c');
      }, (error) => {
        return error instanceof Error && error.message === 'Unexpected character "!" found at 1';
      });

      assert.throws(() => {
        unescapeUnicode('à03c');
      }, (error) => {
        return error instanceof Error && error.message === 'Unexpected character "à" found at 0';
      });
    });
  });

  context('when "\\" is present at beginning of input', () => {
    context('and is followed by "u" (lower case)', () => {
      it('should convert Unicode values after "u"', () => {
        for (const [ input, expected ] of Object.entries(tests)) {
          const actual = unescapeUnicode(`\\u${input}`);

          assert.equal(actual, expected);
        }
      });
    });

    context('and is followed by "U" (upper case)', () => {
      it('should throw an error', () => {
        assert.throws(() => {
          unescapeUnicode('\\U003c');
        }, (error) => {
          return error instanceof Error && error.message === 'Unexpected character "U" found at 1';
        });
      });
    });

    context('and is followed by any character other than "u" (lower case)', () => {
      it('should throw an error', () => {
        assert.throws(() => {
          unescapeUnicode('\\003c');
        }, (error) => {
          return error instanceof Error && error.message === 'Unexpected character "0" found at 1';
        });

        assert.throws(() => {
          unescapeUnicode('\\x003c');
        }, (error) => {
          return error instanceof Error && error.message === 'Unexpected character "x" found at 1';
        });
      });
    });

    context('and remaining input is too short', () => {
      it('should throw an error', () => {
        assert.throws(() => {
          unescapeUnicode('\\u003');
        }, (error) => {
          return error instanceof Error && error.message === 'Insufficient characters found: -1';
        });
      });
    });
  });

  context('when start is specified', () => {
    const prefix = 'Test this: ';

    it('should convert Unicode escape at start in input', () => {
      for (const [ input, expected ] of Object.entries(tests)) {
        const actual = unescapeUnicode(`${prefix}${input}`, prefix.length);

        assert.equal(actual, expected);
      }
    });

    context('and start is negative', () => {
      it('should convert from beginning of input', () => {
        for (const [ input, expected ] of Object.entries(tests)) {
          const actual = unescapeUnicode(input, -10);

          assert.equal(actual, expected);
        }
      });
    });

    context('and start is null', () => {
      it('should convert from beginning of input', () => {
        for (const [ input, expected ] of Object.entries(tests)) {
          const actual = unescapeUnicode(input, null);

          assert.equal(actual, expected);
        }
      });
    });

    context('when start is greater than length of input', () => {
      it('should throw an error', () => {
        assert.throws(() => {
          unescapeUnicode('003c', 10);
        }, (error) => {
          return error instanceof Error && error.message === 'Insufficient characters found: -4';
        });
      });
    });

    context('and input is null', () => {
      it('should return null', () => {
        const actual = unescapeUnicode(null, 0);

        assert.strictEqual(actual, null);
      });
    });

    context('when input is empty', () => {
      it('should throw an error', () => {
        assert.throws(() => {
          unescapeUnicode('', 0);
        }, (error) => {
          return error instanceof Error && error.message === 'Insufficient characters found: -4';
        });
      });
    });

    context('and input is too short', () => {
      it('should throw an error', () => {
        assert.throws(() => {
          unescapeUnicode(`${prefix}003`, prefix.length);
        }, (error) => {
          return error instanceof Error && error.message === 'Insufficient characters found: -1';
        });
      });
    });

    context('and input contains invalid Unicode values', () => {
      it('should throw an error', () => {
        assert.throws(() => {
          unescapeUnicode(`${prefix}003g`, prefix.length);
        }, (error) => {
          return error instanceof Error && error.message === `Unexpected character "g" found at ${prefix.length + 3}`;
        });

        assert.throws(() => {
          unescapeUnicode(`${prefix}00zc`, prefix.length);
        }, (error) => {
          return error instanceof Error && error.message === `Unexpected character "z" found at ${prefix.length + 2}`;
        });

        assert.throws(() => {
          unescapeUnicode(`${prefix}0!3c`, prefix.length);
        }, (error) => {
          return error instanceof Error && error.message === `Unexpected character "!" found at ${prefix.length + 1}`;
        });

        assert.throws(() => {
          unescapeUnicode(`${prefix}à03c`, prefix.length);
        }, (error) => {
          return error instanceof Error && error.message === `Unexpected character "à" found at ${prefix.length}`;
        });
      });
    });

    context('and "\\" is present at start in input', () => {
      context('and is followed by "u" (lower case)', () => {
        it('should convert Unicode values after "u"', () => {
          for (const [ input, expected ] of Object.entries(tests)) {
            const actual = unescapeUnicode(`${prefix}\\u${input}`, prefix.length);

            assert.equal(actual, expected);
          }
        });
      });

      context('and is followed by "U" (upper case)', () => {
        it('should throw an error', () => {
          assert.throws(() => {
            unescapeUnicode(`${prefix}\\U003c`, prefix.length);
          }, (error) => {
            return error instanceof Error && error.message === `Unexpected character "U" found at ${prefix.length + 1}`;
          });
        });
      });

      context('and is followed by any character other than "u" (lower case)', () => {
        it('should throw an error', () => {
          assert.throws(() => {
            unescapeUnicode(`${prefix}\\003c`, prefix.length);
          }, (error) => {
            return error instanceof Error && error.message === `Unexpected character "0" found at ${prefix.length + 1}`;
          });

          assert.throws(() => {
            unescapeUnicode(`${prefix}\\x003c`, prefix.length);
          }, (error) => {
            return error instanceof Error && error.message === `Unexpected character "x" found at ${prefix.length + 1}`;
          });
        });
      });

      context('and remaining input is too short', () => {
        it('should throw an error', () => {
          assert.throws(() => {
            unescapeUnicode(`${prefix}\\u003`, prefix.length);
          }, (error) => {
            return error instanceof Error && error.message === 'Insufficient characters found: -1';
          });
        });
      });
    });
  });
});
