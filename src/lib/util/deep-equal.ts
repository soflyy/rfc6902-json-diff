/**
 * The MIT License (MIT)
 *
 * Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const has = Object.prototype.hasOwnProperty;

export function deepEqual(foo: unknown, bar: unknown): boolean {
  if (foo === bar) {
    return true;
  }

  let ctor, len;

  if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
    if (ctor === Date) {
      return (foo as Date).getTime() === (bar as Date).getTime();
    }
    if (ctor === RegExp) {
      return foo.toString() === bar.toString();
    }

    if (ctor === Array) {
      if (
        (len = (foo as Array<unknown>).length) ===
        (bar as Array<unknown>).length
      ) {
        while (
          len-- &&
          deepEqual((foo as Array<unknown>)[len], (bar as Array<unknown>)[len])
        );
      }
      return len === -1;
    }

    if (!ctor || typeof foo === "object") {
      len = 0;
      for (ctor in foo) {
        if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
        if (
          !(ctor in (bar as object)) ||
          !deepEqual(
            (foo as Record<keyof never, unknown>)[ctor],
            (bar as Record<keyof never, unknown>)[ctor]
          )
        )
          return false;
      }
      return Object.keys(bar).length === len;
    }
  }

  // only true when foo and bar are both NaN
  return foo !== foo && bar !== bar;
}
