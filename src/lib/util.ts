export function normalizePathComponent(path: string): string {
  if (path.charAt(0) === "/") {
    path = path.substring(1);
  }

  if (path.endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }

  return path;
}

export function appendToPath(path: string, key: number | string) {
  return `${path}/${normalizePathComponent(String(key))}`;
}
