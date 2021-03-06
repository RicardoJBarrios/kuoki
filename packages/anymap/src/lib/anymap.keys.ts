/* istanbul ignore file */

class TestClass {}

function testFunction() {
  return;
}

export const ANYMAP_KEYS: Record<string, any[]> = {
  boolean: [true, false],
  Boolean: [new Boolean(true), new Boolean(false)],
  undefined: [undefined],
  null: [null],
  string: [''],
  String: [new String('')],
  Symbol: [Symbol('')],
  Number: [new Number(0)],
  Infinity: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  NaN: [Number.NaN],
  integer: [Number.MIN_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER],
  decimal: [0.0],
  binary: [0b0],
  octal: [0o0],
  hexadecimal: [0x0],
  exponent: [0e1],
  bigint: [BigInt(0)],
  plainObject: [{}, Object.create(null)],
  namedObject: [new TestClass()],
  anonymousFunction: [() => null],
  namedFunction: [testFunction],
  Array: [[]],
  Int8Array: [new Int8Array(0)],
  Int16Array: [new Int16Array(0)],
  Int32Array: [new Int32Array(0)],
  Uint8Array: [new Uint8Array(0)],
  Uint8ClampedArray: [new Uint8ClampedArray(0)],
  Uint16Array: [new Uint16Array(0)],
  Uint32Array: [new Uint32Array(0)],
  Float32Array: [new Float32Array(0)],
  Float64Array: [new Float64Array(0)],
  BigInt64Array: [new BigInt64Array(0)],
  BigUint64Array: [new BigUint64Array(0)],
  Map: [new Map()],
  Set: [new Set()],
  WeakMap: [new WeakMap()],
  WeakSet: [new WeakSet()],
  ArrayBuffer: [new ArrayBuffer(0)],
  SharedArrayBuffer: [new SharedArrayBuffer(0)],
  DataView: [new DataView(new ArrayBuffer(0))],
  Date: [new Date()],
  RegExp: [/a/],
  Error: [new Error()],
  EvalError: [new EvalError()],
  RangeError: [new RangeError()],
  ReferenceError: [new ReferenceError()],
  SyntaxError: [new SyntaxError()],
  TypeError: [new TypeError()],
  URIError: [new URIError()],
  Math: [Math],
  Atomics: [Atomics],
  JSON: [JSON],
  Element: [document.body],
  Window: [window],
  Event: [new Event('')],
  Document: [new Document()],
  DocumentFragment: [new DocumentFragment()]
};
