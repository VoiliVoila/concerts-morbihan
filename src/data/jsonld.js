// Serializes JSON-LD safely for an HTML <script> element. Event data comes
// from third-party sources; escaping HTML-significant characters prevents it
// from closing the script element during parsing.
export function jsonLd(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
