import { test } from "node:test";
import assert from "node:assert/strict";
import { splitAlternativeMarkers } from "./alternative-markers.ts";

test("no marker → empty array (continuation line)", () => {
  assert.deepEqual(splitAlternativeMarkers("um texto qualquer sem marcador"), []);
});

test("single marker at start of line (one column)", () => {
  const result = splitAlternativeMarkers("a) texto da alternativa");
  assert.deepEqual(result, [{ letter: "A", text: "texto da alternativa" }]);
});

test("single marker with leading parenthesis", () => {
  const result = splitAlternativeMarkers("(B) outra alternativa");
  assert.deepEqual(result, [{ letter: "B", text: "outra alternativa" }]);
});

test("two markers on the same line (two-column layout, A/C)", () => {
  const result = splitAlternativeMarkers("a) 500 a 1.500 c) 1.000");
  assert.deepEqual(result, [
    { letter: "A", text: "500 a 1.500" },
    { letter: "C", text: "1.000" },
  ]);
});

test("two markers on the same line (two-column layout, B/D)", () => {
  const result = splitAlternativeMarkers("b) 7.000 d) 2.000 a 3.500");
  assert.deepEqual(result, [
    { letter: "B", text: "7.000" },
    { letter: "D", text: "2.000 a 3.500" },
  ]);
});

test("irregular whitespace around markers is tolerated", () => {
  const result = splitAlternativeMarkers("a)   500 a 1.500    c)     1.000");
  assert.deepEqual(result, [
    { letter: "A", text: "500 a 1.500" },
    { letter: "C", text: "1.000" },
  ]);
});

test("does not match a letter+paren embedded inside a word", () => {
  // "banana)" — the 'a' right before ')' has no word boundary before it.
  const result = splitAlternativeMarkers("o cliente comeu uma banana) e saiu");
  assert.deepEqual(result, []);
});

test("supports lowercase and uppercase markers on the same line", () => {
  const result = splitAlternativeMarkers("A) primeira C) terceira");
  assert.deepEqual(result, [
    { letter: "A", text: "primeira" },
    { letter: "C", text: "terceira" },
  ]);
});

test("supports the E marker (A-E provas)", () => {
  const result = splitAlternativeMarkers("e) quinta alternativa");
  assert.deepEqual(result, [{ letter: "E", text: "quinta alternativa" }]);
});
