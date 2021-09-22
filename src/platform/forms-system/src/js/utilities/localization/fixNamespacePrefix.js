export function fixNamespacePrefix(namespace) {
  return function buildStringWithNamespace(key) {
    return `${namespace}:${key}`;
  };
}
